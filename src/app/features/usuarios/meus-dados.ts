import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { DataBrPipe } from '../../shared/pipes/data-br.pipe';
import { EquipamentoAlocacao } from '../equipamento-alocacoes/equipamento-alocacao';
import { EquipamentoAlocacaoService } from '../equipamento-alocacoes/equipamento-alocacao.service';
import { Movimentacao } from '../movimentacoes/movimentacao';
import { MovimentacaoService } from '../movimentacoes/movimentacao.service';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-meus-dados',
  imports: [RouterLink, DataBrPipe],
  templateUrl: './meus-dados.html',
  styleUrl: '../../shared/page.scss',
})
export class MeusDados {
  private readonly usuarioService = inject(UsuarioService);
  private readonly movimentacaoService = inject(MovimentacaoService);
  private readonly equipamentoAlocacaoService = inject(EquipamentoAlocacaoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usuario = signal<Usuario | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);

  protected readonly licencas = signal<Movimentacao[]>([]);
  protected readonly carregandoLicencas = signal(true);
  protected readonly equipamentos = signal<EquipamentoAlocacao[]>([]);
  protected readonly carregandoEquipamentos = signal(true);

  protected voltar(): void {
    this.router.navigate(['/']);
  }

  constructor() {
    const id = this.authService.obterUsuarioId();
    if (!id) {
      this.erro.set(true);
      this.carregando.set(false);
      this.carregandoLicencas.set(false);
      this.carregandoEquipamentos.set(false);
      return;
    }

    this.usuarioService.obter(id).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });

    this.movimentacaoService.listar({ usuarioId: id, status: 'Em uso' }).subscribe({
      next: (pagina) => {
        this.licencas.set(pagina.itens);
        this.carregandoLicencas.set(false);
      },
      error: () => this.carregandoLicencas.set(false),
    });

    this.equipamentoAlocacaoService.listar({ usuarioId: id, status: 'Em uso' }).subscribe({
      next: (pagina) => {
        this.equipamentos.set(pagina.itens);
        this.carregandoEquipamentos.set(false);
      },
      error: () => this.carregandoEquipamentos.set(false),
    });
  }
}
