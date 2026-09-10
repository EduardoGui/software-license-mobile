import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { NotaDebitoPj } from '../notas-debito-pj/nota-debito-pj';
import { NotaDebitoPjService } from '../notas-debito-pj/nota-debito-pj.service';
import { ReembolsoDespesa } from '../reembolsos/reembolso-despesa';
import { ReembolsoDespesaService } from '../reembolsos/reembolso-despesa.service';

const LIMITE_PREVIA = 5;
const STATUS_ABERTOS = ['Rascunho', 'EnviadoParaAprovacao', 'DevolvidoParaRevisao'];
const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DataBrPipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: '../../shared/page.scss',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly notaDebitoPjService = inject(NotaDebitoPjService);
  private readonly router = inject(Router);

  protected readonly reembolsosAbertos = signal<ReembolsoDespesa[]>([]);
  protected readonly carregandoReembolsos = signal(true);
  protected readonly aprovacoesPendentes = signal<ReembolsoDespesa[]>([]);
  protected readonly carregandoAprovacoes = signal(true);
  protected readonly temAprovacaoAprovada = signal(false);
  protected readonly notasPendentes = signal<NotaDebitoPj[]>([]);
  protected readonly carregandoNotas = signal(true);
  protected readonly temNotaDebito = signal(false);

  protected mesAno(nota: NotaDebitoPj): string {
    return `${NOMES_MESES[nota.mes - 1]}/${nota.ano}`;
  }

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

      // Só aparece pra quem tem alguma nota de débito (colaborador PJ) - a maioria não tem nenhuma.
      this.notaDebitoPjService.listar({ usuarioId }).subscribe({
        next: (notas) => {
          this.temNotaDebito.set(notas.length > 0);
          this.notasPendentes.set(
            notas
              .filter((n) => n.status !== 'Recebida')
              .sort((a, b) => b.ano - a.ano || b.mes - a.mes)
              .slice(0, LIMITE_PREVIA),
          );
          this.carregandoNotas.set(false);
        },
        error: () => this.carregandoNotas.set(false),
      });
    } else {
      this.carregandoReembolsos.set(false);
      this.carregandoNotas.set(false);
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
