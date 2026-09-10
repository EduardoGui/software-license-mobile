export type NotaDebitoPjStatus = 'Rascunho' | 'Enviada' | 'Recebida';

export const ROTULOS_STATUS: Record<NotaDebitoPjStatus, string> = {
  Rascunho: 'Rascunho',
  Enviada: 'Aguardando pagamento',
  Recebida: 'Pagamento recebido',
};

export interface NotaDebitoPj {
  id: number;
  usuarioId: number;
  ano: number;
  mes: number;
  valorBruto: number;
  desconto: number;
  retencaoTributaria: number;
  valorLiquido: number;
  operadoraSaude: string;
  numeroDocumento: string | null;
  descricao: string | null;
  dataVencimento: string | null;
  formaPagamento: string | null;
  status: NotaDebitoPjStatus;
  dataEnvio: string | null;
  dataPagamento: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface NotaDebitoPjFiltro {
  ano?: number;
  mes?: number;
  usuarioId?: number;
  status?: string;
}
