import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RecessoDoColaborador } from './recesso-colaborador';

@Injectable({ providedIn: 'root' })
export class RecessoColaboradorService {
  private readonly http = inject(HttpClient);

  listarDoUsuario(usuarioId: number): Observable<RecessoDoColaborador[]> {
    return this.http.get<RecessoDoColaborador[]>(`${environment.apiUrl}/usuarios/${usuarioId}/recessos`);
  }
}
