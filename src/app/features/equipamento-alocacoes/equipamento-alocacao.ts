export interface EquipamentoAlocacao {
  id: number;
  equipamentoId: number;
  equipamentoDescricao: string;
  dataInicio: string;
  dataFim: string | null;
  status: 'Em uso' | 'Encerrado';
}

export interface EquipamentoAlocacaoFiltro {
  usuarioId?: number;
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
