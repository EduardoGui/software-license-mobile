export interface EquipamentoAlocacao {
  id: number;
  equipamentoId: number;
  equipamentoDescricao: string;
  usuarioId: number;
  usuarioNome: string;
  dataInicio: string;
  dataFim: string | null;
  observacao: string | null;
  status: 'Em uso' | 'Encerrado';
}

export interface EquipamentoAlocacaoPayload {
  equipamentoId: number;
  usuarioId: number;
  dataInicio: string;
  observacao: string | null;
}

export interface EncerrarEquipamentoAlocacaoPayload {
  dataFim: string;
  observacao: string | null;
}

export interface EquipamentoAlocacaoFiltro {
  status?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

export interface PaginaEquipamentoAlocacoes {
  itens: EquipamentoAlocacao[];
  totalRegistros: number;
  pagina: number;
  tamanhoPagina: number;
}
