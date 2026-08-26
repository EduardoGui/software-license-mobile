import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { ComprovanteItem } from './comprovante-item';
import { ReembolsoDespesa, ROTULOS_STATUS } from './reembolso-despesa';
import { ReembolsoDespesaService } from './reembolso-despesa.service';

@Component({
  selector: 'app-reembolso-aprovacao-detalhe',
  imports: [DataBrPipe, DecimalPipe, ComprovanteItem],
  templateUrl: './reembolso-aprovacao-detalhe.html',
  styleUrl: '../../shared/page.scss',
})
export class ReembolsoAprovacaoDetalhe {
  private readonly reembolsoDespesaService = inject(ReembolsoDespesaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly reembolso = signal<ReembolsoDespesa | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly aprovando = signal(false);

  protected voltar(): void {
    this.router.navigate(['/aprovacoes']);
  }

  protected rotuloStatus(status: string): string {
    return ROTULOS_STATUS[status as keyof typeof ROTULOS_STATUS] ?? status;
  }

  constructor() {
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

  protected aprovar(): void {
    const reembolso = this.reembolso();
    if (!reembolso || !confirm(`Aprovar o reembolso Nº ${reembolso.numero} de ${reembolso.usuarioNome}?`)) {
      return;
    }

    this.aprovando.set(true);
    this.reembolsoDespesaService.aprovar(reembolso.id).subscribe({
      next: (aprovado) => {
        if (aprovado.avisoEmail) {
          alert(aprovado.avisoEmail);
        }
        this.router.navigate(['/aprovacoes']);
      },
      error: (err) => {
        this.aprovando.set(false);
        alert(err?.error?.message ?? 'Não foi possível aprovar o reembolso.');
      },
    });
  }

  protected devolver(): void {
    const reembolso = this.reembolso();
    if (!reembolso) {
      return;
    }
    this.router.navigate(['/aprovacoes', reembolso.id, 'devolver'], {
      state: { numero: reembolso.numero, usuarioNome: reembolso.usuarioNome },
    });
  }

  protected reprovar(): void {
    const reembolso = this.reembolso();
    if (!reembolso) {
      return;
    }
    this.router.navigate(['/aprovacoes', reembolso.id, 'reprovar'], {
      state: { numero: reembolso.numero, usuarioNome: reembolso.usuarioNome },
    });
  }
}
