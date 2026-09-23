import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { PeriodoFerias } from './periodo-ferias';
import { PeriodoFeriasService } from './periodo-ferias.service';
import { ProgramacaoFeriasService } from './programacao-ferias.service';

@Component({
  selector: 'app-solicitar-ferias',
  imports: [ReactiveFormsModule],
  templateUrl: './solicitar-ferias.html',
  styleUrl: '../../shared/page.scss',
})
export class SolicitarFerias {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly periodoFeriasService = inject(PeriodoFeriasService);
  private readonly programacaoFeriasService = inject(ProgramacaoFeriasService);
  private readonly router = inject(Router);

  protected readonly periodo = signal<PeriodoFerias | null>(null);
  protected readonly carregando = signal(true);
  protected readonly enviando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly semPeriodo = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    dataInicio: ['', Validators.required],
    quantidadeDias: [5, [Validators.required, Validators.min(1), Validators.max(30)]],
    observacao: [''],
    adiantamentoDecimoTerceiro: [false],
    abonoPecuniario: [false],
    diasAbono: this.fb.control<number | null>(null),
  });

  protected voltar(): void {
    this.router.navigate(['/minhas-ferias']);
  }

  constructor() {
    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) {
      this.semPeriodo.set(true);
      this.carregando.set(false);
      return;
    }

    this.periodoFeriasService.listarDoUsuario(usuarioId).subscribe({
      next: (periodos) => {
        this.periodo.set(periodos[0] ?? null);
        this.semPeriodo.set(periodos.length === 0);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar seu período de férias.');
        this.carregando.set(false);
      },
    });
  }

  protected solicitar(): void {
    if (this.form.invalid || !this.periodo()) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    const payload = {
      dataInicio: valor.dataInicio,
      quantidadeDias: valor.quantidadeDias,
      observacao: valor.observacao || null,
      adiantamentoDecimoTerceiro: valor.adiantamentoDecimoTerceiro,
      abonoPecuniario: valor.abonoPecuniario,
      diasAbono: valor.abonoPecuniario ? (valor.diasAbono ?? 0) : 0,
    };

    this.enviando.set(true);
    this.erro.set(null);

    this.programacaoFeriasService.criar(this.periodo()!.id, payload).subscribe({
      next: (criada) => {
        this.programacaoFeriasService.solicitar(criada.id).subscribe({
          next: () => this.router.navigate(['/minhas-ferias']),
          error: (err) => {
            this.enviando.set(false);
            this.erro.set(
              err?.error?.message ?? 'O pedido foi criado, mas não foi possível enviar para aprovação. Tente novamente.',
            );
          },
        });
      },
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível criar o pedido de férias.');
      },
    });
  }
}
