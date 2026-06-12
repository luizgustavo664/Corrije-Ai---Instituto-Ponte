import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  enviarProva,
  getProvaPublica,
  iniciarProva,
  listarRespostas,
  salvarResposta,
  uploadAnexo,
} from "../../../src/features/aluno/aluno.api";
import type {
  ProvaIniciadaDto,
  ProvaPublicaDto,
  QuestaoPublicaDto,
  RespostaAlunoDto,
  SalvarRespostaPayload,
} from "../../../src/features/aluno/aluno.types";
import { TelaAcesso } from "./components/TelaAcesso";
import { TelaInstrucao } from "./components/TelaInstrucao";
import { TelaProva } from "./components/TelaProva";
import { TelaRevisao } from "./components/TelaRevisao";
import { TelaPreEntrega } from "./components/TelaPreEntrega";
import { TelaConfirmacao } from "./components/TelaConfirmacao";

export type Screen = "acesso" | "instrucao" | "prova" | "revisao" | "pre-entrega" | "confirmacao";

export interface Question {
  id: string;
  displayOrder: number;
  type: QuestaoPublicaDto["tipo"];
  statement: string;
  answer: string;
  marked: boolean;
  alternatives: QuestaoPublicaDto["alternativas"];
  respostaId?: string;
}

export interface StudentInfo {
  name: string;
  email: string;
  cpf: string;
}

const WARNING_TIME = 600;

function extractUrlAcesso() {
  const path = window.location.pathname;
  const marker = "/aluno/prova/";
  const markerIndex = path.indexOf(marker);
  if (markerIndex >= 0) {
    return decodeURIComponent(path.slice(markerIndex + marker.length).replace(/^\/+|\/+$/g, ""));
  }

  return "";
}

export function formatTime(seconds: number): string {
  const m = Math.max(1, Math.round(seconds / 60));
  return `${m} min`;
}

function hasTimeLimit(tempoLimiteMin?: number | null): tempoLimiteMin is number {
  return typeof tempoLimiteMin === "number" && tempoLimiteMin > 0;
}

function mapQuestoes(questoes: QuestaoPublicaDto[], respostas: RespostaAlunoDto[] = []): Question[] {
  const respostasByQuestao = new Map(respostas.map((resposta) => [resposta.questaoId, resposta]));

  return questoes.map((questao) => {
    const resposta = respostasByQuestao.get(questao.id);
    return {
      id: questao.id,
      displayOrder: questao.ordem,
      type: questao.tipo,
      statement: questao.enunciado.conteudoLatex,
      answer: resposta?.alternativaId ?? resposta?.respostaTexto ?? "",
      marked: false,
      alternatives: questao.alternativas,
      respostaId: resposta?.id,
    };
  });
}

function buildRespostaPayload(question: Question, rascunho = true): SalvarRespostaPayload | null {
  if (!question.answer.trim()) return null;

  if (question.type === "discursiva") {
    return {
      respostaTexto: question.answer.trim(),
      rascunho,
    };
  }

  return {
    alternativaId: question.answer,
    rascunho,
  };
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-[#05245F] font-semibold">{message}</p>
      </div>
    </div>
  );
}

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center max-w-sm">
        <h1 className="text-[#05245F] font-bold text-xl mb-2">{title}</h1>
        <p className="text-[#666666] text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export default function App() {
  const urlAcesso = extractUrlAcesso();
  const [screen, setScreen] = useState<Screen>("acesso");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: "", email: "", cpf: "" });
  const [provaAlunoId, setProvaAlunoId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const examStarted = useRef(false);
  const questionsRef = useRef(questions);
  const provaAlunoIdRef = useRef(provaAlunoId);

  const provaPublicaQuery = useQuery({
    queryKey: ["aluno", "prova-publica", urlAcesso],
    queryFn: () => getProvaPublica(urlAcesso),
    enabled: !!urlAcesso,
  });

  const iniciarProvaMutation = useMutation({
    mutationFn: (info: StudentInfo) =>
      iniciarProva(urlAcesso, {
        nome: info.name,
        email: info.email,
        cpf: info.cpf.replace(/\D/g, ""),
        aceiteTermos: true,
      }),
  });

  const salvarRespostaMutation = useMutation({
    mutationFn: ({ questaoId, payload }: { questaoId: string; payload: SalvarRespostaPayload }) => {
      const id = provaAlunoIdRef.current;
      if (!id) throw new Error("Prova ainda não iniciada.");
      return salvarResposta(id, questaoId, payload);
    },
    onError: (error) => setSyncError(error.message),
    onSuccess: (data, variables) => {
      setSyncError(null);
      if (data?.id) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === variables.questaoId ? { ...q, respostaId: data.id } : q)),
        );
      }
    },
  });

  const uploadAnexoMutation = useMutation({
    mutationFn: ({ respostaId, file }: { respostaId: string; file: File }) =>
      uploadAnexo(respostaId, file),
  });

  const enviarProvaMutation = useMutation({
    mutationFn: async () => {
      const currentQuestions = questionsRef.current;
      const currentProvaAlunoId = provaAlunoIdRef.current;
      if (!currentProvaAlunoId) throw new Error("Prova ainda não iniciada.");

      await Promise.all(
        currentQuestions
          .map((question) => ({ question, payload: buildRespostaPayload(question, false) }))
          .filter((item): item is { question: Question; payload: SalvarRespostaPayload } => !!item.payload)
          .map(({ question, payload }) => salvarResposta(currentProvaAlunoId, question.id, payload)),
      );

      return enviarProva(currentProvaAlunoId);
    },
    onSuccess: () => {
      stopTimer();
      setShowSubmitWarning(false);
      setScreen("confirmacao");
    },
  });

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (examStarted.current) return;
    examStarted.current = true;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          setScreen("pre-entrega");
          return 0;
        }
        if (t === WARNING_TIME) {
          setShowTimeWarning(true);
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    const timeouts = saveTimeouts.current;
    return () => {
      stopTimer();
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [stopTimer]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    provaAlunoIdRef.current = provaAlunoId;
  }, [provaAlunoId]);

  useEffect(() => {
    const tempoLimiteMin = provaPublicaQuery.data?.tempoLimiteMin;
    if (hasTimeLimit(tempoLimiteMin) && !examStarted.current) {
      setTimeLeft(tempoLimiteMin * 60);
    }
  }, [provaPublicaQuery.data?.tempoLimiteMin]);

  async function restoreQuestions(provaIniciada: ProvaIniciadaDto) {
    const respostas = await listarRespostas(provaIniciada.provaAlunoId).catch(() => []);
    setQuestions(mapQuestoes(provaIniciada.questoes, respostas));
  }

  const handleAcesso = async (info: StudentInfo) => {
    try {
      setStudentInfo(info);
      const provaIniciada = await iniciarProvaMutation.mutateAsync(info);
      setProvaAlunoId(provaIniciada.provaAlunoId);
      await restoreQuestions(provaIniciada);

      if (provaIniciada.status === "enviada" || provaIniciada.status === "corrigida") {
        setScreen("confirmacao");
        return;
      }

      setScreen("instrucao");
    } catch {
      // Erro exposto via iniciarProvaMutation.isError no TelaAcesso
    }
  };

  const handleStart = () => {
    if (hasTimeLimit(provaPublicaQuery.data?.tempoLimiteMin)) {
      startTimer();
    } else {
      examStarted.current = true;
    }
    setScreen("prova");
  };

  const scheduleSave = (question: Question) => {
    const payload = buildRespostaPayload(question, true);
    if (!payload || !provaAlunoIdRef.current) return;

    if (saveTimeouts.current[question.id]) {
      clearTimeout(saveTimeouts.current[question.id]);
    }

    const delay = question.type === "discursiva" ? 800 : 0;
    saveTimeouts.current[question.id] = setTimeout(() => {
      salvarRespostaMutation.mutate({ questaoId: question.id, payload });
    }, delay);
  };

  const handleFileUpload = (questaoId: string) => {
    const question = questions.find((q) => q.id === questaoId);
    if (!question) return;

    if (!question.respostaId) {
      const payload = buildRespostaPayload(question, true);
      if (!payload) return;

      const id = provaAlunoIdRef.current;
      if (!id) return;

      salvarRespostaMutation.mutate(
        { questaoId, payload },
        {
          onSuccess: (data) => {
            if (data?.id) {
              openFilePicker(data.id);
            }
          },
        },
      );
      return;
    }

    openFilePicker(question.respostaId);
  };

  function openFilePicker(respostaId: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png,.pdf";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        uploadAnexoMutation.mutate({ respostaId, file });
      }
    };
    input.click();
  }

  const updateAnswer = (index: number, answer: string) => {
    setQuestions((prev) => {
      const next = prev.map((q, i) => (i === index ? { ...q, answer } : q));
      scheduleSave(next[index]);
      return next;
    });
  };

  const toggleMark = (index: number) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, marked: !q.marked } : q)));
  };

  const goToQuestion = (index: number) => {
    setCurrentQIndex(Math.max(0, Math.min(questions.length - 1, index)));
    setScreen("prova");
  };

  const handleFinalize = () => {
    setScreen("pre-entrega");
  };

  const handleConfirm = () => {
    setShowSubmitWarning(true);
  };

  const handleSubmit = () => {
    enviarProvaMutation.mutate();
  };

  if (!urlAcesso) {
    return <ErrorState title="Link inválido" message="Abra a prova usando o link ou QR Code enviado pelo professor." />;
  }

  if (provaPublicaQuery.isLoading) {
    return <LoadingState message="Carregando prova..." />;
  }

  if (provaPublicaQuery.isError) {
    return <ErrorState title="Não foi possível abrir a prova" message={provaPublicaQuery.error.message} />;
  }

  const provaPublica = provaPublicaQuery.data as ProvaPublicaDto;
  const markedQuestions = questions.filter((q) => q.marked);
  const blankQuestions = questions.filter((q) => !q.answer.trim());
  const timerStr = hasTimeLimit(provaPublica.tempoLimiteMin) ? formatTime(timeLeft) : "Sem limite";
  const accessError = iniciarProvaMutation.isError ? iniciarProvaMutation.error.message : undefined;
  const submitError = enviarProvaMutation.isError ? enviarProvaMutation.error.message : undefined;

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative bg-[#F2F2F2]">
        {screen === "acesso" && (
          <TelaAcesso
            onNext={handleAcesso}
            isLoading={iniciarProvaMutation.isPending}
            errorMessage={accessError}
          />
        )}

        {screen === "instrucao" && (
          <TelaInstrucao prova={provaPublica} onStart={handleStart} />
        )}

        {screen === "prova" && (
          <TelaProva
            questions={questions}
            currentQIndex={currentQIndex}
            timeLeft={timerStr}
            showTimeWarning={showTimeWarning}
            studentInfo={studentInfo}
            syncMessage={
              salvarRespostaMutation.isPending
                ? "Salvando rascunho..."
                : syncError
                  ? syncError
                  : undefined
            }
            uploadMessage={
              uploadAnexoMutation.isPending
                ? "Enviando arquivo..."
                : uploadAnexoMutation.isError
                  ? uploadAnexoMutation.error.message
                  : undefined
            }
            onAnswerChange={updateAnswer}
            onToggleMark={toggleMark}
            onNext={() => {
              if (currentQIndex < questions.length - 1) setCurrentQIndex((c) => c + 1);
            }}
            onPrev={() => {
              if (currentQIndex > 0) setCurrentQIndex((c) => c - 1);
            }}
            onFinalize={handleFinalize}
            onGoToQuestion={goToQuestion}
            onReviewMarked={() => setScreen("revisao")}
            onDismissTimeWarning={() => setShowTimeWarning(false)}
            onTimeWarningFinalize={handleFinalize}
            onTriggerWarningDemo={() => setShowTimeWarning(true)}
            onFileUpload={handleFileUpload}
          />
        )}

        {screen === "revisao" && (
          <TelaRevisao
            questions={questions}
            markedQuestions={markedQuestions}
            timeLeft={timerStr}
            onGoToQuestion={goToQuestion}
            onBack={() => setScreen("prova")}
            onFinalize={handleFinalize}
          />
        )}

        {screen === "pre-entrega" && (
          <TelaPreEntrega
            questions={questions}
            blankQuestions={blankQuestions}
            timeLeft={timerStr}
            showSubmitWarning={showSubmitWarning}
            isSubmitting={enviarProvaMutation.isPending}
            errorMessage={submitError}
            onGoToQuestion={goToQuestion}
            onBack={() => setScreen("prova")}
            onConfirm={handleConfirm}
            onDismissWarning={() => setShowSubmitWarning(false)}
            onSubmit={handleSubmit}
          />
        )}

        {screen === "confirmacao" && <TelaConfirmacao studentInfo={studentInfo} />}
      </div>
    </div>
  );
}
