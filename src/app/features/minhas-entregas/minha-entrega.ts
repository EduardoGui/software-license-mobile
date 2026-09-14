export interface MinhaEntregaItem {
  id: number;
  descricao: string;
  tamanho: string | null;
  quantidade: number;
  validade: string | null;
}

export interface MinhaEntrega {
  id: number;
  campanhaNome: string;
  status: 'Confirmado' | 'Divergencia';
  dataEntregaFisica: string | null;
  dataConfirmacao: string | null;
  itens: MinhaEntregaItem[];
}
