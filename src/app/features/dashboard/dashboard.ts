import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ReembolsoDespesa } from '../reembolsos/reembolso-despesa';
import { ReembolsoDespesaService } from '../reembolsos/reembolso-despesa.service';

const LIMITE_PREVIA = 5;
const STATUS_ABERTOS = ['Rascunho', 'EnviadoParaAprovacao', 'DevolvidoParaRevisao'];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DataBrPipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: '../../shared/page.scss',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly router = inject(Router);

  protected readonly reembolsosAbertos = signal<ReembolsoDespesa[]>([]);
  protected readonly carregandoReembolsos = signal(true);
  protected readonly aprovacoesPendentes = signal<ReembolsoDespesa[]>([]);
  protected readonly carregandoAprovacoes = signal(true);
  protected readonly temAprovacaoAprovada = signal(false);

  protected sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  constructor() {
    const usuarioId = this.authService.obterUsuarioId();

    if (usuarioId) {
      this.reembolsoDespesaService.listar({ usuarioId }).subscribe({
        next: (reembolsos) => {
          this.reembolsosAbertos.set(
            reembolsos
              .filter((r) => STATUS_ABERTOS.includes(r.status))
              .sort((a, b) => b.dataSolicitacao.localeCompare(a.dataSolicitacao))
              .slice(0, LIMITE_PREVIA),
          );
          this.carregandoReembolsos.set(false);
        },
        error: () => this.carregandoReembolsos.set(false),
      });
    } else {
      this.carregandoReembolsos.set(false);
    }

    this.reembolsoDespesaService.listarPendentesAprovacao().subscribe({
      next: (reembolsos) => {
        this.aprovacoesPendentes.set(reembolsos.slice(0, LIMITE_PREVIA));
        this.carregandoAprovacoes.set(false);
      },
      error: () => this.carregandoAprovacoes.set(false),
    });

    // Só usado para decidir se a seção de aprovações aparece mesmo com a fila zerada -
    // sem isso, um aprovador sem pendentes no momento perderia o acesso ao próprio histórico.
    this.reembolsoDespesaService.listarAprovadosPorMim().subscribe({
      next: (reembolsos) => this.temAprovacaoAprovada.set(reembolsos.length > 0),
      error: () => {},
    });
  }
}
