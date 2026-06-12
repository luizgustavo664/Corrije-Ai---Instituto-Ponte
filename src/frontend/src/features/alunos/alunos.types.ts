export type AlunoDto = {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  aceitouTermosEm: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type UpdateAlunoPayload = {
  nome?: string;
  email?: string;
  cpf?: string | null;
};
