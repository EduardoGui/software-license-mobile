import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AnexosSecao } from '../../shared/anexos/anexos-secao';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { NotaDebitoPj, ROTULOS_STATUS } from './nota-debito-pj';
import { NotaDebitoPjService } from './nota-debito-pj.service';

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

@Component({
  selector: 'app-nota-debito-pj-detalhe',
  imports: [DataBrPipe, DecimalPipe, AnexosSecao],
  templateUrl: './nota-debito-pj-detalhe.html',
  styleUrl: '../../shared/page.scss',
})
export class NotaDebitoPjDetalhe {
  private readonly notaService = inject(NotaDebitoPjService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly nota = signal<NotaDebitoPj | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly abrindoPdf = signal(false);

  protected voltar(): void {
    this.router.navigate(['/notas-debito-pj']);
  }

  protected rotuloStatus(status: string): string {
    return ROTULOS_STATUS[status as keyof typeof ROTULOS_STATUS] ?? status;
  }

  protected mesAno(nota: NotaDebitoPj): string {
    return `${NOMES_MESES[nota.mes - 1]}/${nota.ano}`;
  }

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.notaService.obter(this.id).subscribe({
      next: (nota) => {
        this.nota.set(nota);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar esta nota de débito.');
        this.carregando.set(false);
      },
    });
  }

  protected abrirPdf(): void {
    // A aba precisa abrir aqui, de forma síncrona com o clique — se abrir só depois
    // da resposta da API (assíncrona), o navegador bloqueia como pop-up.
    const aba = window.open('', '_blank');
    this.abrindoPdf.set(true);

    this.notaService.baixarPdf(this.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        if (aba) {
          aba.location.href = url;
        }
        setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
        this.abrindoPdf.set(false);
      },
      error: () => {
        aba?.close();
        this.abrindoPdf.set(false);
        alert('Não foi possível abrir o PDF.');
      },
    });
  }
}
