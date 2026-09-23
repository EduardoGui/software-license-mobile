import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { PeriodoFerias } from './periodo-ferias';
import { PeriodoFeriasService } from './periodo-ferias.service';
import { ProgramacaoFerias, ROTULOS_STATUS_PROGRAMACAO } from './programacao-ferias';
import { ProgramacaoFeriasService } from './programacao-ferias.service';

const STATUS_CANCELAVEIS = ['Rascunho', 'Solicitada', 'Aprovada'];

@Component({
  selector: 'app-minhas-ferias-list',
  imports: [DataBrPipe, RouterLink],
  templateUrl: './minhas-ferias-list.html',
  styleUrl: '../../shared/page.scss',
})
export class MinhasFeriasList {
  private readonly programacaoService = inject(ProgramacaoFeriasService);
  private readonly periodoFeriasService = inject(PeriodoFeriasService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private usuarioId: number | null = null;

  protected readonly periodo = signal<PeriodoFerias | null>(null);
  protected readonly programacoes = signal<ProgramacaoFerias[]>([]);
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
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.programacaoService.listarDoUsuario(this.usuarioId!).subscribe({
      next: (programacoes) => {
        this.programacoes.set(programacoes.sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)));
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
