import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ReembolsoDespesa } from './reembolso-despesa';
import { ReembolsoDespesaService } from './reembolso-despesa.service';

@Component({
  selector: 'app-reembolsos-pendentes-list',
  imports: [RouterLink, DataBrPipe, DecimalPipe],
  templateUrl: './reembolsos-pendentes-list.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsosPendentesList {
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly router = inject(Router);

  protected readonly reembolsos = signal<ReembolsoDespesa[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly aprovandoId = signal<number | null>(null);

  protected voltar(): void {
    this.router.navigate(['/']);
  }

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.reembolsoDespesaService.listarPendentesAprovacao().subscribe({
      next: (reembolsos) => {
        this.reembolsos.set(reembolsos);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  protected aprovar(reembolso: ReembolsoDespesa): void {
    if (!confirm(`Aprovar o reembolso Nº ${reembolso.numero} de ${reembolso.usuarioNome}?`)) {
      return;
    }

    this.aprovandoId.set(reembolso.id);
    this.reembolsoDespesaService.aprovar(reembolso.id).subscribe({
      next: () => {
        this.aprovandoId.set(null);
        this.carregar();
      },
      error: (err) => {
        this.aprovandoId.set(null);
        alert(err?.error?.message ?? 'Não foi possível aprovar o reembolso.');
      },
    });
  }
}
