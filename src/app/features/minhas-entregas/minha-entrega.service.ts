import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MinhaEntrega } from './minha-entrega';

@Injectable({ providedIn: 'root' })
export class MinhaEntregaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/minhas-entregas`;

  listar(): Observable<MinhaEntrega[]> {
    return this.http.get<MinhaEntrega[]>(this.baseUrl);
  }
}
