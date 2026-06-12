export type ExamBadge = "Rascunho" | "Publicada" | "Encerrada" | "Antiga";

export interface Exam {
  id: number;
  title: string;
  modalidade: string;
  discipline: string;
  subject: string;
  turma: string;
  semester: string;
  badge: ExamBadge;
  submissions: string;
  tempoProva?: number;
  dataLimite?: string;
  orientacoes?: string;
}

export const defaultExams: Exam[] = [
  { id: 1, title: "Avaliação Final - Cálculo Diferencial III", modalidade: "Prova", discipline: "Matemática", subject: "Matemática", turma: "Eng-301A", semester: "1º Semestre 2026", badge: "Publicada", submissions: "48" },
  { id: 2, title: "Exame Parcial - Mecânica Quântica", modalidade: "Prova", discipline: "Física Moderna", subject: "Física Moderna", turma: "Fis-402B", semester: "1º Semestre 2026", badge: "Rascunho",  submissions: "42" },
  { id: 3, title: "Teste Intermediário - Química Orgânica", modalidade: "Prova", discipline: "Química", subject: "Química", turma: "Qui-205A", semester: "2º Semestre 2025", badge: "Encerrada", submissions: "55" },
  { id: 4, title: "Prova Diagnóstica - Biologia Molecular", modalidade: "Prova", discipline: "Biologia", subject: "Biologia", turma: "Bio-308B", semester: "2º Semestre 2025", badge: "Publicada", submissions: "39" },
  { id: 5, title: "Avaliação Semestral - História Contemporânea", modalidade: "Prova", discipline: "História", subject: "História", turma: "Hum-101A", semester: "1º Semestre 2025", badge: "Antiga",    submissions: "51" },
  { id: 6, title: "Exame Complementar - Geografia Econômica", modalidade: "Prova", discipline: "Geografia", subject: "Geografia", turma: "Geo-204B", semester: "1º Semestre 2025", badge: "Rascunho",  submissions: "37" },
  { id: 7, title: "Prova Final - Literatura Brasileira", modalidade: "Prova", discipline: "Português", subject: "Português", turma: "Let-305A", semester: "2º Semestre 2024", badge: "Encerrada", submissions: "46" },
  { id: 8, title: "Teste Aplicado - Estruturas de Dados", modalidade: "Prova", discipline: "Computação", subject: "Computação", turma: "Comp-401A", semester: "1º Semestre 2026", badge: "Publicada", submissions: "44" },
  { id: 9, title: "Avaliação Integrada - Termodinâmica", modalidade: "Prova", discipline: "Engenharia", subject: "Engenharia", turma: "Eng-503B", semester: "1º Semestre 2026", badge: "Publicada", submissions: "50" },
  { id: 10, title: "Prova Bimestral - Álgebra Linear", modalidade: "Prova", discipline: "Matemática", subject: "Matemática", turma: "Mat-206A", semester: "2º Semestre 2025", badge: "Encerrada", submissions: "53" },
];
