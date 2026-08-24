import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Local } from '../locais/local';
import { LocalService } from '../locais/local.service';
import { TipoDespesa } from '../tipos-despesa/tipo-despesa';
import { TipoDespesaService } from '../tipos-despesa/tipo-despesa.service';
import { ReembolsoDespesaService } from './reembolso-despesa.service';

@Component({
  selector: 'app-reembolso-form',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './reembolso-form.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsoForm {
  private readonly fb = inject(FormBuilder);
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly localService = inject(LocalService);
  private readonly tipoDespesaService = inject(TipoDespesaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly reembolsoId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
  protected readonly editando = this.reembolsoId !== null;

  protected readonly locais = signal<Local[]>([]);
  protected readonly tiposDespesa = signal<TipoDespesa[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    finalidade: ['', Validators.required],
    formaPagamento: ['PIX'],
    localId: this.fb.control<number | null>(null),
    observacao: [''],
    itens: this.fb.array<ReturnType<typeof this.criarLinhaItem>>([]),
  });

  protected get itens() {
    return this.form.controls.itens;
  }

  private criarLinhaItem(valores?: { data: string; tipoDespesaId: number | null; descricao: string | null; numeroDocumento: string | null; valor: number }) {
    return this.fb.nonNullable.group({
      data: [valores?.data ?? new Date().toISOString().slice(0, 10), Validators.required],
      tipoDespesaId: this.fb.control<number | null>(valores?.tipoDespesaId ?? null, Validators.required),
      descricao: [valores?.descricao ?? ''],
      numeroDocumento: [valores?.numeroDocumento ?? ''],
      valor: [valores?.valor ?? 0, [Validators.required, Validators.min(0.01)]],
    });
  }

  protected adicionarItem(): void {
    this.itens.push(this.criarLinhaItem());
  }

  protected removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  protected calcularTotal(): number {
    return this.itens.controls.reduce((total, controle) => total + (Number(controle.get('valor')?.value) || 0), 0);
  }

  protected voltar(): void {
    this.router.navigate(this.editando ? ['/reembolsos', this.reembolsoId!] : ['/reembolsos']);
  }

  constructor() {
    this.localService.listar({ ativo: true }).subscribe((locais) => this.locais.set(locais));
    this.tipoDespesaService.listar({ ativo: true }).subscribe((tipos) => this.tiposDespesa.set(tipos));

    if (!this.editando) {
      this.itens.push(this.criarLinhaItem());
      this.carregando.set(false);
      return;
    }

    this.reembolsoDespesaService.obter(this.reembolsoId!).subscribe({
      next: (reembolso) => {
        this.form.patchValue({
          finalidade: reembolso.finalidade,
          formaPagamento: reembolso.formaPagamento ?? '',
          localId: reembolso.localId,
          observacao: reembolso.observacao ?? '',
        });

        if (reembolso.itens.length === 0) {
          this.itens.push(this.criarLinhaItem());
        } else {
          for (const item of reembolso.itens) {
            this.itens.push(
              this.criarLinhaItem({
                data: item.data,
                tipoDespesaId: item.tipoDespesaId,
                descricao: item.descricao,
                numeroDocumento: item.numeroDocumento,
                valor: item.valor,
              }),
            );
          }
        }

        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar este reembolso.');
        this.carregando.set(false);
      },
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    const payload = {
      finalidade: valor.finalidade,
      formaPagamento: valor.formaPagamento || null,
      localId: valor.localId,
      observacao: valor.observacao || null,
      itens: valor.itens.map((item) => ({
        data: item.data,
        tipoDespesaId: item.tipoDespesaId,
        descricao: item.descricao || null,
        numeroDocumento: item.numeroDocumento || null,
        valor: item.valor,
      })),
    };

    this.salvando.set(true);
    this.erro.set(null);

    const requisicao = this.editando
      ? this.reembolsoDespesaService.atualizar(this.reembolsoId!, payload)
      : this.reembolsoDespesaService.criar(payload);

    requisicao.subscribe({
      next: (reembolso) => this.router.navigate(['/reembolsos', reembolso.id]),
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível salvar o reembolso.');
      },
    });
  }
}
