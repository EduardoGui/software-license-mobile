import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ComprovanteItem } from './comprovante-item';
import { ReembolsoDespesa, ROTULOS_STATUS, STATUS_EDITAVEIS } from './reembolso-despesa';
import { ReembolsoDespesaService } from './reembolso-despesa.service';

@Component({
  selector: 'app-reembolso-detalhe',
  imports: [RouterLink, DataBrPipe, DecimalPipe, ComprovanteItem],
  templateUrl: './reembolso-detalhe.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsoDetalhe {
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly reembolso = signal<ReembolsoDespesa | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly enviando = signal(false);
  protected readonly excluindo = signal(false);

  protected voltar(): void {
    this.router.navigate(['/reembolsos']);
  }

  protected rotuloStatus(status: string): string {
    return ROTULOS_STATUS[status as keyof typeof ROTULOS_STATUS] ?? status;
  }

  protected editavel(): boolean {
    const status = this.reembolso()?.status;
    return !!status && STATUS_EDITAVEIS.includes(status);
  }

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.reembolsoDespesaService.obter(this.id).subscribe({
      next: (reembolso) => {
        this.reembolso.set(reembolso);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar este reembolso.');
        this.carregando.set(false);
      },
    });
  }

  protected enviarParaAprovacao(): void {
    if (!confirm('Enviar este reembolso para aprovação?')) {
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.reembolsoDespesaService.enviar(this.id).subscribe({
      next: (reembolso) => {
        this.reembolso.set(reembolso);
        this.enviando.set(false);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível enviar o reembolso.');
      },
    });
  }

  protected excluir(): void {
    if (!confirm('Excluir este reembolso? Essa ação não pode ser desfeita.')) {
      return;
    }

    this.excluindo.set(true);
    this.erro.set(null);

    this.reembolsoDespesaService.excluir(this.id).subscribe({
      next: () => this.router.navigate(['/reembolsos']),
      error: (err) => {
        this.excluindo.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível excluir o reembolso.');
      },
    });
  }
}
