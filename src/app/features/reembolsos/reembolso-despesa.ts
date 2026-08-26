import { Anexo } from '../../shared/anexos/anexo';

export type ReembolsoDespesaStatus = 'Rascunho' | 'EnviadoParaAprovacao' | 'DevolvidoParaRevisao' | 'Aprovado' | 'Reprovado';

export const STATUS_EDITAVEIS: ReembolsoDespesaStatus[] = ['Rascunho', 'DevolvidoParaRevisao'];

export const ROTULOS_STATUS: Record<ReembolsoDespesaStatus, string> = {
  Rascunho: 'Rascunho',
  EnviadoParaAprovacao: 'Enviado para aprovação',
  DevolvidoParaRevisao: 'Devolvido para revisão',
  Aprovado: 'Aprovado',
  Reprovado: 'Reprovado',
};

export interface ReembolsoDespesaItem {
  id: number;
  data: string;
  tipoDespesaId: number;
  tipoDespesaNome: string;
  descricao: string | null;
  numeroDocumento: string | null;
  valor: number;
  anexos: Anexo[];
}

export interface ReembolsoDespesa {
  id: number;
  numero: string;
  usuarioId: number;
  usuarioNome: string;
  setorId: number | null;
  setorNome: string | null;
  localId: number | null;
  localNome: string | null;
  dataSolicitacao: string;
  finalidade: string;
  formaPagamento: string | null;
  status: ReembolsoDespesaStatus;
  aprovadorId: number | null;
  aprovadorNome: string | null;
  observacaoAprovador: string | null;
  dataDecisao: string | null;
  observacao: string | null;
  itens: ReembolsoDespesaItem[];
  valorTotal: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface ReembolsoDespesaItemPayload {
  // Id do item já existente (preenchido ao editar), para o backend atualizar em vigor e preservar
  // o comprovante anexado a ele. Null para um item novo.
  id: number | null;
  data: string;
  tipoDespesaId: number | null;
  descricao: string | null;
  numeroDocumento: string | null;
  valor: number;
}

export interface ReembolsoDespesaPayload {
  finalidade: string;
  formaPagamento: string | null;
  localId: number | null;
  observacao: string | null;
  itens: ReembolsoDespesaItemPayload[];
}

export interface ReembolsoDespesaFiltro {
  usuarioId?: number;
  status?: string;
}
