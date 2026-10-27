import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { PeriodoFerias } from './periodo-ferias';
import { PeriodoFeriasService } from './periodo-ferias.service';
import { RecessoDoColaborador, ROTULOS_SITUACAO_RECESSO } from './recesso-colaborador';
import { RecessoColaboradorService } from './recesso-colaborador.service';
import { ProgramacaoFerias, ROTULOS_STATUS_PROGRAMACAO } from './programacao-ferias';
import { ProgramacaoFeriasService } from './programacao-ferias.service';

const STATUS_CANCELAVEIS = ['Rascunho', 'Solicitada', 'Aprovada'];
const ANOS_DE_HISTORICO = 2;

// Linha única da tela: uma programação de férias ou um recesso coletivo confirmado.
interface ItemFerias {
  chave: string;
  dataInicio: string;
  dataFim: string;
  programacao: ProgramacaoFerias | null;
  recesso: RecessoDoColaborador | null;
}

function paraIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-minhas-ferias-list',
  imports: [DataBrPipe, NgTemplateOutlet, RouterLink],
  templateUrl: './minhas-ferias-list.html',
  styleUrl: '../../shared/page.scss',
})
export class MinhasFeriasList {
  private readonly programacaoService = inject(ProgramacaoFeriasService);
  private readonly periodoFeriasService = inject(PeriodoFeriasService);
  private readonly recessoService = inject(RecessoColaboradorService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private usuarioId: number | null = null;

  protected readonly periodo = signal<PeriodoFerias | null>(null);
  protected readonly programacoes = signal<ProgramacaoFerias[]>([]);
  protected readonly recessos = signal<RecessoDoColaborador[]>([]);

  // Próximas/em andamento (mais próxima primeiro) e histórico dos últimos 2 anos (mais recente primeiro).
  private readonly itens = computed<ItemFerias[]>(() => [
    ...this.programacoes().map((p) => ({ chave: `f${p.id}`, dataInicio: p.dataInicio, dataFim: p.dataFim, programacao: p, recesso: null })),
    ...this.recessos().map((r) => ({ chave: `r${r.id}`, dataInicio: r.dataInicio, dataFim: r.dataFim, programacao: null, recesso: r })),
  ]);
  protected readonly proximos = computed(() => {
    const hoje = paraIso(new Date());
    return this.itens().filter((i) => i.dataFim >= hoje).sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));
  });
  protected readonly historico = computed(() => {
    const hoje = new Date();
    const limite = paraIso(new Date(hoje.getFullYear() - ANOS_DE_HISTORICO, hoje.getMonth(), hoje.getDate()));
    return this.itens()
      .filter((i) => i.dataFim < paraIso(hoje) && i.dataFim >= limite)
      .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
  });
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly semUsuario = signal(false);
  protected readonly cancelandoId = signal<number | null>(null);

  protected voltar(): void {
    this.router.navigate(['/']);
  }

  protected rotuloStatus(programacao: ProgramacaoFerias): string {
    return ROTULOS_STATUS_PROGRAMACAO[programacao.statusEfetivo] ?? programacao.statusEfetivo;
  }

  protected rotuloSituacaoRecesso(recesso: RecessoDoColaborador): string {
    return ROTULOS_SITUACAO_RECESSO[recesso.situacao];
  }

  protected podeCancelar(programacao: ProgramacaoFerias): boolean {
    return STATUS_CANCELAVEIS.includes(programacao.statusEfetivo);
  }

  protected cancelar(programacao: ProgramacaoFerias): void {
    if (!confirm(`Cancelar o pedido de férias de ${programacao.dataInicio} a ${programacao.dataFim}?`)) {
      return;
    }

    this.cancelandoId.set(programacao.id);
    this.programacaoService.cancelar(programacao.id).subscribe({
      next: () => this.carregar(),
      error: (err) => {
        this.cancelandoId.set(null);
        alert(err?.error?.message ?? 'Não foi possível cancelar este pedido.');
      },
    });
  }

  constructor() {
    this.usuarioId = this.authService.obterUsuarioId();
    if (!this.usuarioId) {
      this.semUsuario.set(true);
      this.carregando.set(false);
      return;
    }

    this.periodoFeriasService.listarDoUsuario(this.usuarioId).subscribe((periodos) => this.periodo.set(periodos[0] ?? null));
    this.recessoService.listarDoUsuario(this.usuarioId).subscribe({
      next: (recessos) => this.recessos.set(recessos),
      // Recesso é informação complementar: se falhar, as férias continuam aparecendo.
      error: () => this.recessos.set([]),
    });
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.programacaoService.listarDoUsuario(this.usuarioId!).subscribe({
      next: (programacoes) => {
        this.programacoes.set(programacoes);
        this.carregando.set(false);
        this.cancelandoId.set(null);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
        this.cancelandoId.set(null);
      },
    });
  }
}
