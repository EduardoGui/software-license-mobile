import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Local } from './local';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/locais`;

  listar(filtro: { ativo?: boolean } = {}): Observable<Local[]> {
    let params = new HttpParams();
    if (filtro.ativo !== undefined) params = params.set('ativo', filtro.ativo);

    return this.http.get<Local[]>(this.baseUrl, { params });
  }
}
