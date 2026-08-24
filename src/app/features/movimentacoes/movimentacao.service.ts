import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MovimentacaoFiltro, PaginaMovimentacoes } from './movimentacao';

@Injectable({ providedIn: 'root' })
export class MovimentacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/movimentacoes`;

  listar(filtro: MovimentacaoFiltro = {}): Observable<PaginaMovimentacoes> {
    let params = new HttpParams();
    if (filtro.usuarioId) params = params.set('usuarioId', filtro.usuarioId);
    if (filtro.status) params = params.set('status', filtro.status);
    params = params.set('pagina', filtro.pagina ?? 1);
    params = params.set('tamanhoPagina', filtro.tamanhoPagina ?? 50);

    return this.http.get<PaginaMovimentacoes>(this.baseUrl, { params });
  }
}
