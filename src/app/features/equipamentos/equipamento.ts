export interface Equipamento {
  id: number;
  tipoEquipamentoNome: string;
  marca: string | null;
  modelo: string | null;
  patrimonio: string | null;
  status: 'Disponivel' | 'EmUso' | 'Manutencao' | 'Baixado';
}

export interface EquipamentoFiltro {
  status?: string;
}
