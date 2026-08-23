import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EquipamentoAlocacao } from '../equipamento-alocacoes/equipamento-alocacao';
import { EquipamentoAlocacaoService } from '../equipamento-alocacoes/equipamento-alocacao.service';

@Component({
  selector: 'app-equipamento-devolver',
  imports: [RouterLink],
  templateUrl: './equipamento-devolver.html',
  styleUrl: './acao-page.scss',
})
export class EquipamentoDevolver {
  private readonly equipamentoAlocacaoService = inject(EquipamentoAlocacaoService);
  private readonly location = inject(Location);

  protected readonly alocacoes = signal<EquipamentoAlocacao[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);

  constructor() {
    this.carregar();
  }

  protected voltar(): void {
    this.location.back();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.equipamentoAlocacaoService.listar({ status: 'Em uso' }).subscribe({
      next: (pagina) => {
        this.alocacoes.set(pagina.itens);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }
}
