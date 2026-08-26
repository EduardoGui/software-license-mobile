import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ReembolsoDespesa } from './reembolso-despesa';
import { ReembolsoDespesaService } from './reembolso-despesa.service';

@Component({
  selector: 'app-reembolsos-aprovados-list',
  imports: [RouterLink, DataBrPipe, DecimalPipe],
  templateUrl: './reembolsos-aprovados-list.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsosAprovadosList {
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly router = inject(Router);

  protected readonly reembolsos = signal<ReembolsoDespesa[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);

  protected voltar(): void {
    this.router.navigate(['/aprovacoes']);
  }

  constructor() {
    this.reembolsoDespesaService.listarAprovadosPorMim().subscribe({
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
}
