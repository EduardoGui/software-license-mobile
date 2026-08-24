export interface Movimentacao {
  id: number;
  licencaId: number;
  licencaNome: string;
  dataInicio: string;
  dataFim: string | null;
  status: 'Em uso' | 'Encerrado';
}

export interface MovimentacaoFiltro {
  usuarioId?: number;
  status?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

export interface PaginaMovimentacoes {
  itens: Movimentacao[];
  totalRegistros: number;
  pagina: number;
  tamanhoPagina: number;
}
