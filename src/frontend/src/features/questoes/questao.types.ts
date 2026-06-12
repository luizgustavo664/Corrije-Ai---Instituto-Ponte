export type QuestionType = "Alternativa" | "V/F" | "Discursiva";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: { letter: string; text: string; correct: boolean }[];
  answer?: string;
}
