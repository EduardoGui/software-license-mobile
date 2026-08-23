import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EquipamentoAlocacaoService } from '../equipamento-alocacoes/equipamento-alocacao.service';
import { Usuario } from '../usuarios/usuario';
import { UsuarioService } from '../usuarios/usuario.service';
import { Equipamento } from './equipamento';
import { EquipamentoService } from './equipamento.service';

@Component({
  selector: 'app-equipamento-alocar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './equipamento-alocar.html',
  styleUrl: './acao-page.scss',
})
export class EquipamentoAlocar {
  private readonly fb = inject(FormBuilder);
  private readonly equipamentoAlocacaoService = inject(EquipamentoAlocacaoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly equipamentoService = inject(EquipamentoService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly equipamentosDisponiveis = signal<Equipamento[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly sucesso = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    usuarioId: [0, [Validators.required, Validators.min(1)]],
    equipamentoId: [0, [Validators.required, Validators.min(1)]],
    dataInicio: [new Date().toISOString().slice(0, 10), Validators.required],
    observacao: [''],
  });

  constructor() {
    this.carregando.set(true);
    this.usuarioService.listar({ status: 'Ativo' }).subscribe((usuarios) => {
      this.usuarios.set(usuarios);
      this.carregando.set(false);
    });
    this.equipamentoService.listar({ status: 'Disponivel' }).subscribe((equipamentos) => this.equipamentosDisponiveis.set(equipamentos));
  }

  protected voltar(): void {
    this.location.back();
  }

  protected descreverEquipamento(equipamento: Equipamento): string {
    const descricao = [equipamento.tipoEquipamentoNome, equipamento.marca, equipamento.modelo].filter(Boolean).join(' ');
    return equipamento.patrimonio ? `${descricao} (${equipamento.patrimonio})` : descricao;
  }

  protected alocarOutro(): void {
    this.sucesso.set(false);
    this.form.reset({ usuarioId: 0, equipamentoId: 0, dataInicio: new Date().toISOString().slice(0, 10), observacao: '' });
    this.equipamentoService.listar({ status: 'Disponivel' }).subscribe((equipamentos) => this.equipamentosDisponiveis.set(equipamentos));
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    const payload = {
      usuarioId: valor.usuarioId,
      equipamentoId: valor.equipamentoId,
      dataInicio: valor.dataInicio,
      observacao: valor.observacao || null,
    };

    this.salvando.set(true);
    this.erro.set(null);

    this.equipamentoAlocacaoService.alocar(payload).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set(true);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível registrar a alocação.');
      },
    });
  }
}
