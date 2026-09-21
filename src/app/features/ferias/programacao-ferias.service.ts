import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProgramacaoFerias } from './programacao-ferias';

@Injectable({ providedIn: 'root' })
export class ProgramacaoFeriasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listarDoUsuario(usuarioId: number): Observable<ProgramacaoFerias[]> {
    return this.http.get<ProgramacaoFerias[]>(`${this.baseUrl}/${usuarioId}/programacoes-ferias`);
  }
}
