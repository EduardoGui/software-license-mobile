export type RecessoSituacao = 'Programado' | 'EmAndamento' | 'Concluido';

export interface RecessoDoColaborador {
  id: number;
  recessoCorporativoId: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  diasCorridos: number;
  diasAbatidos: number;
  situacao: RecessoSituacao;
}

export const ROTULOS_SITUACAO_RECESSO: Record<RecessoSituacao, string> = {
  Programado: 'Programado',
  EmAndamento: 'Em andamento',
  Concluido: 'Concluído',
};
