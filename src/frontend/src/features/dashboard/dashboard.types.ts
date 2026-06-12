import type { Question } from "../questoes/questao.types";

export type ExamBadge = "Rascunho" | "Publicada" | "Encerrada" | "Antiga";

export interface Exam {
  id: string;
  title: string;
  modalidade: string;
  discipline: string;
  subject: string;
  turma: string;
  semester: string;
  badge: ExamBadge;
  submissions: string;
  tempoProva?: number;
  dataInicio?: string;
  dataLimite?: string;
  orientacoes?: string;
  materiaId?: string;
  criadoEm?: string;
  embaralharQuestoes?: boolean;
  embaralharAlternativas?: boolean;
  urlAcesso?: string;
  qrCode?: string;
}

export interface BancoQuestion {
  id: string;
  type: Question["type"];
  materia: string;
  materiaId: string;
  semestre: string;
  dificuldade: string;
  text: string;
  options?: Question["options"];
  answer?: string;
  pontuacaoPadrao?: number;
  timesUsed: number;
  successRate: number;
}
