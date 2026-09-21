import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ProgramacaoFerias, ROTULOS_STATUS_PROGRAMACAO } from './programacao-ferias';
import { ProgramacaoFeriasService } from './programacao-ferias.service';

@Component({
  selector: 'app-minhas-ferias-list',
  imports: [DataBrPipe],
  templateUrl: './minhas-ferias-list.html',
  styleUrl: '../../shared/page.scss',
})
export class MinhasFeriasList {
  private readonly programacaoService = inject(ProgramacaoFeriasService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly programacoes = signal<ProgramacaoFerias[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly semUsuario = signal(false);

  protected voltar(): void {
    this.router.navigate(['/']);
  }

  protected rotuloStatus(programacao: ProgramacaoFerias): string {
    return ROTULOS_STATUS_PROGRAMACAO[programacao.statusEfetivo] ?? programacao.statusEfetivo;
  }

  constructor() {
    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) {
      this.semUsuario.set(true);
      this.carregando.set(false);
      return;
    }

    this.programacaoService.listarDoUsuario(usuarioId).subscribe({
      next: (programacoes) => {
        this.programacoes.set(programacoes.sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }
}
