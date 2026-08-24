export interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataInicio: string;
  dataFim: string | null;
  observacao: string | null;
  status: 'Agendado' | 'Ativo' | 'Inativo';
  cpf: string | null;
  cargo: string | null;
  setorId: number | null;
  setorNome: string | null;
  chavePix: string | null;
  banco: string | null;
  agencia: string | null;
  contaBancaria: string | null;
}

export interface PerfilPayload {
  cpf: string | null;
  cargo: string | null;
  setorId: number | null;
  chavePix: string | null;
  banco: string | null;
  agencia: string | null;
  contaBancaria: string | null;
}
