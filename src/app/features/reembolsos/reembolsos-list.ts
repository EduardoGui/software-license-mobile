import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ReembolsoDespesa, ROTULOS_STATUS } from './reembolso-despesa';
import { ReembolsoDespesaService } from './reembolso-despesa.service';

@Component({
  selector: 'app-reembolsos-list',
  imports: [RouterLink, DataBrPipe, DecimalPipe],
  templateUrl: './reembolsos-list.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsosList {
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly reembolsos = signal<ReembolsoDespesa[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly semUsuario = signal(false);

  protected voltar(): void {
    this.router.navigate(['/']);
  }

  protected rotuloStatus(status: string): string {
    return ROTULOS_STATUS[status as keyof typeof ROTULOS_STATUS] ?? status;
  }

  constructor() {
    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) {
      this.semUsuario.set(true);
      this.carregando.set(false);
      return;
    }

    this.reembolsoDespesaService.listar({ usuarioId }).subscribe({
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
