import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addQuestaoToProva, listProvaQuestoes, removeQuestaoFromProva } from "../provas/provas.api";
import { mapProvaQuestaoToQuestion } from "../provas/provas.mappers";
import { mapQuestaoToQuestion } from "../questoes/questoes.mappers";
import type { Question } from "../questoes/questao.types";
import type { CreateQuestaoPayload } from "../questoes/questoes.types";
import type { QuestaoBancoDto } from "../questoes/questoes.types";
import type { BancoQuestion } from "./dashboard.types";
import {
  createDraftQuestionFromBanco,
  getNextDraftQuestionId,
  isDraftQuestionId,
  isPersistedId,
} from "./dashboard.ui-adapter";

type UseProvaQuestoesParams = {
  selectedExamId: string | null;
  examQuestions: Question[];
  setExamQuestions: Dispatch<SetStateAction<Question[]>>;
  createQuestao: (payload: CreateQuestaoPayload) => Promise<QuestaoBancoDto>;
};

export function useProvaQuestoes({
  selectedExamId,
  examQuestions,
  setExamQuestions,
  createQuestao,
}: UseProvaQuestoesParams) {
  const queryClient = useQueryClient();

  const provaQuestoesQuery = useQuery({
    queryKey: ["provas", selectedExamId, "questoes"],
    queryFn: () => listProvaQuestoes(selectedExamId ?? ""),
    enabled: !!selectedExamId,
    select: (items) => items.map(mapProvaQuestaoToQuestion),
  });

  const addQuestaoProvaMutation = useMutation({
    mutationFn: ({
      provaId,
      questaoId,
      ordemOriginal,
      pontuacaoMax,
    }: {
      provaId: string;
      questaoId: string;
      ordemOriginal: number;
      pontuacaoMax?: number;
    }) => addQuestaoToProva(provaId, { questaoId, ordemOriginal, pontuacaoMax }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["provas", variables.provaId, "questoes"] });
    },
  });

  const removeQuestaoProvaMutation = useMutation({
    mutationFn: ({ provaId, questaoId }: { provaId: string; questaoId: string }) =>
      removeQuestaoFromProva(provaId, questaoId),
    onSuccess: (_data, variables) => {
      setExamQuestions((prev) => prev.filter((question) => question.id !== variables.questaoId));
      void queryClient.invalidateQueries({ queryKey: ["provas", variables.provaId, "questoes"] });
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ["provas"] });
    },
  });

  useEffect(() => {
    if (provaQuestoesQuery.data) {
      setExamQuestions(provaQuestoesQuery.data);
    }
  }, [provaQuestoesQuery.data, setExamQuestions]);

  function addQuestion(q: Question) {
    setExamQuestions((prev) => [...prev, { ...q, id: getNextDraftQuestionId(prev) }]);
  }

  async function addQuestions(questions: Question[]) {
    if (selectedExamId) {
      await Promise.all(
        questions
          .filter((question) => !isDraftQuestionId(question.id))
          .map((question, index) =>
            addQuestaoProvaMutation.mutateAsync({
              provaId: selectedExamId,
              questaoId: question.id,
              ordemOriginal: examQuestions.length + index + 1,
            }),
          ),
      );
      return;
    }

    setExamQuestions((prev) => {
      let nextQuestions = prev;
      const draftQuestions = questions.map((question) => {
        const nextQuestion = { ...question, id: getNextDraftQuestionId(nextQuestions) };
        nextQuestions = [...nextQuestions, nextQuestion];
        return nextQuestion;
      });
      return [...prev, ...draftQuestions];
    });
  }

  function deleteQuestion(id: string) {
    if (selectedExamId && !isDraftQuestionId(id)) {
      removeQuestaoProvaMutation.mutate({ provaId: selectedExamId, questaoId: id });
      return;
    }

    setExamQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(question: Question) {
    setExamQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );
  }

  async function createQuestionForSelectedExam(payload: CreateQuestaoPayload) {
    const questao = await createQuestao(payload);

    if (selectedExamId) {
      await addQuestaoProvaMutation.mutateAsync({
        provaId: selectedExamId,
        questaoId: questao.id,
        ordemOriginal: examQuestions.length + 1,
        pontuacaoMax: questao.pontuacaoPadrao,
      });
      return;
    }

    addQuestion(mapQuestaoToQuestion(questao));
  }

  async function addQuestionToExam(provaId: string, bancoQ: BancoQuestion) {
    if (isPersistedId(provaId) && isPersistedId(bancoQ.id)) {
      try {
        const currentQuestoes =
          selectedExamId === provaId
            ? examQuestions
            : await queryClient.fetchQuery({
              queryKey: ["provas", provaId, "questoes"],
              queryFn: () => listProvaQuestoes(provaId),
            });

        await addQuestaoProvaMutation.mutateAsync({
          provaId,
          questaoId: bancoQ.id,
          ordemOriginal: currentQuestoes.length + 1,
          pontuacaoMax: bancoQ.pontuacaoPadrao,
        });
      } catch {
        const newQuestion = createDraftQuestionFromBanco(bancoQ, examQuestions);
        await addQuestions([newQuestion]);
      }
      return;
    }

    const newQuestion = createDraftQuestionFromBanco(bancoQ, examQuestions);
    await addQuestions([newQuestion]);
  }

  return {
    provaQuestoesQuery,
    addQuestaoProvaMutation,
    removeQuestaoProvaMutation,
    addQuestion,
    addQuestions,
    deleteQuestion,
    updateQuestion,
    createQuestionForSelectedExam,
    addQuestionToExam,
  };
}
