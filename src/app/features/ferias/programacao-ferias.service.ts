import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProgramacaoFerias } from './programacao-ferias';

export interface CriarProgramacaoFeriasPayload {
  dataInicio: string;
  quantidadeDias: number;
  observacao: string | null;
  adiantamentoDecimoTerceiro: boolean;
  abonoPecuniario: boolean;
  diasAbono: number;
}

@Injectable({ providedIn: 'root' })
export class ProgramacaoFeriasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;
  private readonly apiUrl = environment.apiUrl;

  listarDoUsuario(usuarioId: number): Observable<ProgramacaoFerias[]> {
    return this.http.get<ProgramacaoFerias[]>(`${this.baseUrl}/${usuarioId}/programacoes-ferias`);
  }

  criar(periodoFeriasId: number, payload: CriarProgramacaoFeriasPayload): Observable<ProgramacaoFerias> {
    return this.http.post<ProgramacaoFerias>(`${this.apiUrl}/periodos-ferias/${periodoFeriasId}/programacoes`, payload);
  }

  solicitar(id: number): Observable<ProgramacaoFerias> {
    return this.http.patch<ProgramacaoFerias>(`${this.apiUrl}/programacoes-ferias/${id}/solicitar`, {});
  }

  cancelar(id: number): Observable<ProgramacaoFerias> {
    return this.http.patch<ProgramacaoFerias>(`${this.apiUrl}/programacoes-ferias/${id}/cancelar`, {});
  }
}
