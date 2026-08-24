import { Routes } from '@angular/router';

import { authGuard } from './core/auth-guard';
import { Login } from './features/auth/login';
import { Dashboard } from './features/dashboard/dashboard';
import { MeusDados } from './features/usuarios/meus-dados';
import { MeusDadosEditar } from './features/usuarios/meus-dados-editar';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'meus-dados', component: MeusDados, canActivate: [authGuard] },
  { path: 'meus-dados/editar', component: MeusDadosEditar, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
