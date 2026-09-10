import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { NotaDebitoPj, ROTULOS_STATUS } from './nota-debito-pj';
import { NotaDebitoPjService } from './nota-debito-pj.service';

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

@Component({
  selector: 'app-notas-debito-pj-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './notas-debito-pj-list.html',
  styleUrl: '../../shared/page.scss',
})
export class NotasDebitoPjList {
  private readonly notaService = inject(NotaDebitoPjService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly notas = signal<NotaDebitoPj[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly semUsuario = signal(false);

  protected voltar(): void {
    this.router.navigate(['/']);
  }

  protected rotuloStatus(status: string): string {
    return ROTULOS_STATUS[status as keyof typeof ROTULOS_STATUS] ?? status;
  }

  protected mesAno(nota: NotaDebitoPj): string {
    return `${NOMES_MESES[nota.mes - 1]}/${nota.ano}`;
  }

  constructor() {
    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) {
      this.semUsuario.set(true);
      this.carregando.set(false);
      return;
    }

    this.notaService.listar({ usuarioId }).subscribe({
      next: (notas) => {
        this.notas.set(notas.sort((a, b) => b.ano - a.ano || b.mes - a.mes));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }
}
