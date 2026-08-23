import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Usuario, UsuarioFiltro } from './usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listar(filtro: UsuarioFiltro = {}): Observable<Usuario[]> {
    let params = new HttpParams();
    if (filtro.status) params = params.set('status', filtro.status);

    return this.http.get<Usuario[]>(this.baseUrl, { params });
  }
}
