import { Routes } from '@angular/router';

import { authGuard } from './core/auth-guard';
import { Login } from './features/auth/login';
import { Home } from './features/home/home';
import { EquipamentoAlocar } from './features/equipamentos/equipamento-alocar';
import { EquipamentoDevolver } from './features/equipamentos/equipamento-devolver';
import { EquipamentoDevolverConfirmar } from './features/equipamentos/equipamento-devolver-confirmar';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'equipamentos/alocar', component: EquipamentoAlocar, canActivate: [authGuard] },
  { path: 'equipamentos/devolver', component: EquipamentoDevolver, canActivate: [authGuard] },
  { path: 'equipamentos/devolver/:id', component: EquipamentoDevolverConfirmar, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
