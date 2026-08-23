import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EquipamentoAlocacaoService } from '../equipamento-alocacoes/equipamento-alocacao.service';

interface ContextoNavegacao {
  usuarioNome?: string;
  equipamentoDescricao?: string;
}

@Component({
  selector: 'app-equipamento-devolver-confirmar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './equipamento-devolver-confirmar.html',
  styleUrl: './acao-page.scss',
})
export class EquipamentoDevolverConfirmar {
  private readonly fb = inject(FormBuilder);
  private readonly equipamentoAlocacaoService = inject(EquipamentoAlocacaoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private readonly alocacaoId = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly contexto = (history.state ?? {}) as ContextoNavegacao;

  protected readonly salvando = signal(false);
  protected readonly sucesso = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    dataFim: [new Date().toISOString().slice(0, 10), Validators.required],
    observacao: [''],
  });

  protected voltar(): void {
    this.location.back();
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    this.salvando.set(true);
    this.erro.set(null);

    this.equipamentoAlocacaoService.encerrar(this.alocacaoId, { dataFim: valor.dataFim, observacao: valor.observacao || null }).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set(true);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível devolver o equipamento.');
      },
    });
  }
}
