import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-meus-dados-editar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './meus-dados-editar.html',
  styleUrl: '../../shared/page.scss',
})
export class MeusDadosEditar {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly usuarioId = this.authService.obterUsuarioId();
  private usuarioAtual: Usuario | null = null;

  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    chavePix: [''],
    banco: [''],
    agencia: [''],
    contaBancaria: [''],
  });

  protected voltar(): void {
    this.router.navigate(['/meus-dados']);
  }

  constructor() {
    if (!this.usuarioId) {
      this.erro.set('Não foi possível identificar seu usuário.');
      this.carregando.set(false);
      return;
    }

    this.usuarioService.obter(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuarioAtual = usuario;
        this.form.patchValue({
          chavePix: usuario.chavePix ?? '',
          banco: usuario.banco ?? '',
          agencia: usuario.agencia ?? '',
          contaBancaria: usuario.contaBancaria ?? '',
        });
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar seus dados.');
        this.carregando.set(false);
      },
    });
  }

  protected salvar(): void {
    if (!this.usuarioId || !this.usuarioAtual) {
      return;
    }

    const valor = this.form.getRawValue();
    const payload = {
      cpf: this.usuarioAtual.cpf,
      cargo: this.usuarioAtual.cargo,
      setorId: this.usuarioAtual.setorId,
      chavePix: valor.chavePix || null,
      banco: valor.banco || null,
      agencia: valor.agencia || null,
      contaBancaria: valor.contaBancaria || null,
    };

    this.salvando.set(true);
    this.erro.set(null);

    this.usuarioService.atualizarPerfil(this.usuarioId, payload).subscribe({
      next: () => this.router.navigate(['/meus-dados']),
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.message ?? 'Não foi possível salvar os dados.');
      },
    });
  }
}
