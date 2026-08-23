import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Equipamento, EquipamentoFiltro } from './equipamento';

@Injectable({ providedIn: 'root' })
export class EquipamentoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/equipamentos`;

  listar(filtro: EquipamentoFiltro = {}): Observable<Equipamento[]> {
    let params = new HttpParams();
    if (filtro.status) params = params.set('status', filtro.status);

    return this.http.get<Equipamento[]>(this.baseUrl, { params });
  }
}
