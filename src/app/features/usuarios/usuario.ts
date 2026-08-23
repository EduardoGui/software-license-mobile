export interface Usuario {
  id: number;
  nome: string;
  status: 'Agendado' | 'Ativo' | 'Inativo';
}

export interface UsuarioFiltro {
  status?: string;
}
