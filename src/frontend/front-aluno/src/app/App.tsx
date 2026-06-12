import { useState, useEffect, useRef, useCallback } from "react";
import { TelaAcesso } from "./components/TelaAcesso";
import { TelaInstrucao } from "./components/TelaInstrucao";
import { TelaProva } from "./components/TelaProva";
import { TelaRevisao } from "./components/TelaRevisao";
import { TelaPreEntrega } from "./components/TelaPreEntrega";
import { TelaConfirmacao } from "./components/TelaConfirmacao";

export type Screen = "acesso" | "instrucao" | "prova" | "revisao" | "pre-entrega" | "confirmacao";

export interface Question {
  id: number;
  statement: string;
  answer: string;
  marked: boolean;
}

export interface StudentInfo {
  name: string;
  email: string;
  cpf: string;
}

const EXAM_DURATION = 10800; // 3 hours
const WARNING_TIME = 600;    // 10 minutes warning

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    statement:
      "Explique o processo de fotossíntese e sua importância para os ecossistemas terrestres e aquáticos. Descreva as etapas principais da fase luminosa e da fase escura (ciclo de Calvin), e os fatores ambientais que podem influenciar sua eficiência nas plantas.",
    answer: "",
    marked: false,
  },
  {
    id: 2,
    statement:
      "Analise as principais causas e consequências da Primeira Guerra Mundial (1914–1918), discutindo o papel do imperialismo, do nacionalismo exacerbado e dos sistemas de alianças no desencadeamento do conflito. Como o Tratado de Versalhes contribuiu para a instabilidade política posterior?",
    answer: "",
    marked: false,
  },
  {
    id: 3,
    statement:
      "Resolva o sistema de equações e apresente o desenvolvimento completo de cada etapa:\n\n   2x + 3y = 12\n   4x − y = 8\n\nApós encontrar os valores de x e y, verifique a solução substituindo-os nas equações originais.",
    answer: "",
    marked: false,
  },
  {
    id: 4,
    statement:
      "Disserte sobre a importância da leitura crítica na formação do cidadão contemporâneo, relacionando com os desafios impostos pela era digital e a proliferação de desinformação nas redes sociais. Como a escola pode contribuir para o desenvolvimento do pensamento crítico?",
    answer: "",
    marked: false,
  },
  {
    id: 5,
    statement:
      "Explique o conceito de desenvolvimento sustentável e apresente três exemplos concretos de práticas sustentáveis que podem ser adotadas no cotidiano para reduzir o impacto ambiental. Relacione com os Objetivos de Desenvolvimento Sustentável (ODS) da ONU.",
    answer: "",
    marked: false,
  },
];

export function formatTime(seconds: number): string {
  const m = Math.ceil(seconds / 60);
  return `${m} min`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("acesso");
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: "", email: "", cpf: "" });
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const examStarted = useRef(false);

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
        if (t === WARNING_TIME + 1) {
          setShowTimeWarning(true);
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return stopTimer;
  }, [stopTimer]);

  const handleAcesso = (info: StudentInfo) => {
    setStudentInfo(info);
    setScreen("instrucao");
  };

  const handleStart = () => {
    startTimer();
    setScreen("prova");
  };

  const updateAnswer = (index: number, answer: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, answer } : q)));
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
    stopTimer();
    setShowSubmitWarning(false);
    setScreen("confirmacao");
  };

  const markedQuestions = questions.filter((q) => q.marked);
  const blankQuestions = questions.filter((q) => !q.answer.trim());
  const timerStr = formatTime(timeLeft);

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative bg-[#F2F2F2]">
        {screen === "acesso" && <TelaAcesso onNext={handleAcesso} />}

        {screen === "instrucao" && <TelaInstrucao onStart={handleStart} />}

        {screen === "prova" && (
          <TelaProva
            questions={questions}
            currentQIndex={currentQIndex}
            timeLeft={timerStr}
            showTimeWarning={showTimeWarning}
            studentInfo={studentInfo}
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
            markedQuestions={markedQuestions}
            timeLeft={timerStr}
            showSubmitWarning={showSubmitWarning}
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