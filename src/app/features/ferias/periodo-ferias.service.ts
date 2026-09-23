import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PeriodoFerias } from './periodo-ferias';

@Injectable({ providedIn: 'root' })
export class PeriodoFeriasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listarDoUsuario(usuarioId: number): Observable<PeriodoFerias[]> {
    return this.http.get<PeriodoFerias[]>(`${this.baseUrl}/${usuarioId}/periodos-ferias`);
  }
}
