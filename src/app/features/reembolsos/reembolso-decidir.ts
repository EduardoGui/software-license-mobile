import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ReembolsoDespesaService } from './reembolso-despesa.service';

interface ContextoNavegacao {
  numero?: string;
  usuarioNome?: string;
}

@Component({
  selector: 'app-reembolso-decidir',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reembolso-decidir.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsoDecidir {
  private readonly fb = inject(FormBuilder);
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly acao = this.route.snapshot.data['acao'] as 'devolver' | 'reprovar';
  protected readonly contexto = (history.state ?? {}) as ContextoNavegacao;

  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    observacaoAprovador: ['', this.acao === 'devolver' ? Validators.required : []],
  });

  protected voltar(): void {
    this.router.navigate(['/aprovacoes']);
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const observacao = this.form.getRawValue().observacaoAprovador.trim() || null;

    this.salvando.set(true);
    this.erro.set(null);

    const requisicao =
      this.acao === 'devolver'
        ? this.reembolsoDespesaService.devolver(this.id, observacao!)
        : this.reembolsoDespesaService.reprovar(this.id, observacao);

    requisicao.subscribe({
      next: () => this.router.navigate(['/aprovacoes']),
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível registrar a decisão.');
      },
    });
  }
}
