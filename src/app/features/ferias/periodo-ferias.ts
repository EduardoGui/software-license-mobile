export interface PeriodoFerias {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  inicioAquisitivo: string;
  fimAquisitivo: string;
  inicioConcessivo: string;
  fimConcessivo: string;
  diasDireito: number;
  aquisitivoFechado: boolean;
  direitoAdquirido: number;
  projecaoProporcional: number;
  comprometido: number;
  consumido: number;
  saldoDisponivel: number;
}
