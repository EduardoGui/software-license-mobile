import { Routes } from '@angular/router';

import { authGuard } from './core/auth-guard';
import { Login } from './features/auth/login';
import { Dashboard } from './features/dashboard/dashboard';
import { MeusDados } from './features/usuarios/meus-dados';
import { MeusDadosEditar } from './features/usuarios/meus-dados-editar';
import { ReembolsosList } from './features/reembolsos/reembolsos-list';
import { ReembolsoForm } from './features/reembolsos/reembolso-form';
import { ReembolsoDetalhe } from './features/reembolsos/reembolso-detalhe';
import { ReembolsosPendentesList } from './features/reembolsos/reembolsos-pendentes-list';
import { ReembolsoDecidir } from './features/reembolsos/reembolso-decidir';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'meus-dados', component: MeusDados, canActivate: [authGuard] },
  { path: 'meus-dados/editar', component: MeusDadosEditar, canActivate: [authGuard] },
  { path: 'reembolsos', component: ReembolsosList, canActivate: [authGuard] },
  { path: 'reembolsos/novo', component: ReembolsoForm, canActivate: [authGuard] },
  { path: 'reembolsos/:id/editar', component: ReembolsoForm, canActivate: [authGuard] },
  { path: 'reembolsos/:id', component: ReembolsoDetalhe, canActivate: [authGuard] },
  { path: 'aprovacoes', component: ReembolsosPendentesList, canActivate: [authGuard] },
  { path: 'aprovacoes/:id/devolver', component: ReembolsoDecidir, canActivate: [authGuard], data: { acao: 'devolver' } },
  { path: 'aprovacoes/:id/reprovar', component: ReembolsoDecidir, canActivate: [authGuard], data: { acao: 'reprovar' } },
  { path: '**', redirectTo: '' },
];
