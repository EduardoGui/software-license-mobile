import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PerfilPayload, Usuario } from './usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  obter(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  atualizarPerfil(id: number, payload: PerfilPayload): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/${id}/perfil`, payload);
  }
}
