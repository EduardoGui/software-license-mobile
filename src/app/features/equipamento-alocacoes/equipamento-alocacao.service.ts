import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EquipamentoAlocacaoFiltro, PaginaEquipamentoAlocacoes } from './equipamento-alocacao';

@Injectable({ providedIn: 'root' })
export class EquipamentoAlocacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/equipamento-alocacoes`;

  listar(filtro: EquipamentoAlocacaoFiltro = {}): Observable<PaginaEquipamentoAlocacoes> {
    let params = new HttpParams();
    if (filtro.usuarioId) params = params.set('usuarioId', filtro.usuarioId);
    if (filtro.status) params = params.set('status', filtro.status);
    params = params.set('pagina', filtro.pagina ?? 1);
    params = params.set('tamanhoPagina', filtro.tamanhoPagina ?? 50);

    return this.http.get<PaginaEquipamentoAlocacoes>(this.baseUrl, { params });
  }
}
