import { useState } from "react";
import {
  ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon,
  CheckCircleIcon, UserIcon, BookmarkIcon, MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { Question } from "./ProvaDetailPage";
import type { Exam } from "./examTypes";

interface Props {
  onBack: () => void;
  exam: Exam;
  questions: Question[];
}

const students = [
  { id: 1, name: "Lucas Henrique Martins", numero: "01", discursiva: "A derivação da equação de campo de Einstein parte do princípio de ação de Hilbert-Einstein. Aplicando o cálculo variacional obtemos G_μν + Λg_μν = 8πG/c⁴ T_μν.", selectedOption: "B", vfAnswer: "Verdadeiro" },
  { id: 2, name: "Isabela Cristina Souza", numero: "02", discursiva: "Para resolver a integral tripla aplicamos transformação para coordenadas elípticas. O Jacobiano é 24r² sin(θ). O resultado final é 512π/9.", selectedOption: "A", vfAnswer: "Falso" },
  { id: 3, name: "Gabriel Fernando Costa", numero: "03", discursiva: "O teorema de Gauss-Bonnet relaciona curvatura local e topologia global. Para esfera χ=2, logo ∫∫K dA = 4π. Para toro χ=0, integral nula.", selectedOption: "C", vfAnswer: "Verdadeiro" },
  { id: 4, name: "Beatriz Oliveira Santos", numero: "04", discursiva: "A reação de Diels-Alder é uma cicloadição [4+2] concertada. Estereoquímica preservada: dienófilos cis produzem produtos cis. Regioseletividade pelo isômero orto.", selectedOption: "B", vfAnswer: "Verdadeiro" },
  { id: 5, name: "Pedro Augusto Lima", numero: "05", discursiva: "Primos de Mersenne têm forma M_p = 2^p − 1. O maior conhecido é M_136279841 com 41 milhões de dígitos, encontrado pelo projeto GIMPS em 2024.", selectedOption: "D", vfAnswer: "Falso" },
  { id: 6, name: "Mariana Silva Alves", numero: "06", discursiva: "S = k_B ln(Ω) relaciona entropia com microestados. k_B ≈ 1.38×10⁻²³ J/K. Sistemas evoluem para maior número de microestados, consistente com 2ª lei.", selectedOption: "A", vfAnswer: "Verdadeiro" },
  { id: 7, name: "Rafael dos Santos Rocha", numero: "07", discursiva: "Para calcular resíduo em z=0: usando série de Laurent de f(z) = (e^z−1)/(z³sin(z)), o coeficiente de 1/z resulta em Res(f,0) = 1/6.", selectedOption: "B", vfAnswer: "Falso" },
  { id: 8, name: "Amanda Carolina Dias", numero: "08", discursiva: "Para o oscilador harmônico anisotrópico 3D as energias são E_n = ℏ(ω_x(n_x+½) + ω_y(n_y+½) + ω_z(n_z+½)). Funções de onda são produtos de polinômios de Hermite.", selectedOption: "C", vfAnswer: "Verdadeiro" },
  { id: 9, name: "Thiago Roberto Freitas", numero: "09", discursiva: "π₁(K) = ⟨a,b | aba⁻¹b = 1⟩. Grupo não-abeliano. A relação mostra que conjugação por a inverte b, refletindo a não-orientabilidade da garrafa de Klein.", selectedOption: "A", vfAnswer: "Falso" },
  { id: 10, name: "Julia Fernanda Rodrigues", numero: "10", discursiva: "F^μν é antissimétrico: F^0i = E^i/c e F^ij = ε^ijk B_k. As equações ∂_μF^μν = μ₀J^ν são manifestamente covariantes sob transformações de Lorentz.", selectedOption: "B", vfAnswer: "Verdadeiro" },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  Alternativa: { bg: "#EEF1F8", color: "#6B6FA3" },
  "V/F": { bg: "#E6FAF8", color: "#05245F" },
  Discursiva: { bg: "#FFF8E0", color: "#B07D00" },
};

const gradeOptions = ["—", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function getStudentAnswer(student: typeof students[0], question: Question): string {
  if (question.type === "Alternativa") return `Alternativa ${student.selectedOption}`;
  if (question.type === "V/F") return student.vfAnswer;
  return student.discursiva;
}

function isCorrect(student: typeof students[0], question: Question): boolean | null {
  if (question.type === "Alternativa") {
    const correct = question.options?.find((o) => o.correct)?.letter;
    return student.selectedOption === correct;
  }
  if (question.type === "V/F") {
    return student.vfAnswer === question.answer;
  }
  return null; // discursiva: manual
}

export function CorrecaoAlunoPage({ onBack, exam, questions }: Props) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendente" | "corrigido">("todos");
  const [grades, setGrades] = useState<Record<string, string>>({}); // key: `${studentId}-${questionId}`
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Set<number>>(new Set()); // student ids fully saved

  const selectedStudent = students.find((s) => s.id === selectedStudentId) ?? null;

  const gradeKey = (sid: number, qid: number) => `${sid}-${qid}`;

  function autoGrade(student: typeof students[0], question: Question): string {
    const result = isCorrect(student, question);
    if (result === null) return grades[gradeKey(student.id, question.id)] ?? "";
    return result ? "10" : "0";
  }

  function handleGrade(sid: number, qid: number, val: string) {
    setGrades((prev) => ({ ...prev, [gradeKey(sid, qid)]: val }));
  }

  function handleComment(sid: number, qid: number, val: string) {
    setComments((prev) => ({ ...prev, [gradeKey(sid, qid)]: val }));
  }

  function handleSave() {
    if (!selectedStudent) return;
    setSaved((prev) => new Set([...prev, selectedStudent.id]));
    // Advance to next student
    const idx = students.findIndex((s) => s.id === selectedStudent.id);
    const next = students[idx + 1];
    if (next) setSelectedStudentId(next.id);
    else setSelectedStudentId(null);
  }

  function getStudentMedia(sid: number): string {
    if (questions.length === 0) return "—";
    const vals = questions.map((q) => {
      const s = students.find((st) => st.id === sid)!;
      const gk = gradeKey(sid, q.id);
      const g = grades[gk] ?? autoGrade(s, q);
      return g === "" || g === "—" ? null : Number(g);
    });
    const valid = vals.filter((v) => v !== null) as number[];
    if (valid.length === 0) return "—";
    return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
  }

  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.numero.includes(search);
    const matchStatus =
      filterStatus === "todos" ||
      (filterStatus === "corrigido" && saved.has(s.id)) ||
      (filterStatus === "pendente" && !saved.has(s.id));
    return matchSearch && matchStatus;
  });

  // List view
  if (!selectedStudent) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <button onClick={onBack} className="flex items-center gap-2 hover:opacity-70 transition-opacity self-start" style={{ color: "#6A7181" }}>
          <ArrowLeftIcon className="w-5 h-5" />
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 14 }}>Voltar para correções</span>
        </button>

        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#6B6FA3" }}>{exam.title}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6A7181", marginTop: 2 }}>
            Correção por aluno · {exam.submissions} submissões · {saved.size} corrigidos
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl p-4 flex flex-col gap-2" style={{ border: "1px solid #E6E6E6" }}>
          <div className="flex justify-between">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111" }}>Progresso geral</span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#6B6FA3" }}>
              {saved.size}/{students.length} alunos corrigidos
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: "#E5E7EB" }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${(saved.size / students.length) * 100}%`, backgroundColor: "#05245F" }} />
          </div>
        </div>

        {/* Busca + filtro */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9F9F9F" }} />
            <input
              type="text"
              placeholder="Buscar aluno por nome ou número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none"
              style={{ backgroundColor: "#fff", border: "1px solid #D9D9D9", fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111" }}
            />
          </div>
          <div className="flex gap-1 p-1 rounded-xl shrink-0" style={{ backgroundColor: "#fff", border: "1px solid #D7D7D9" }}>
            {(["todos", "pendente", "corrigido"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className="px-3 py-1.5 rounded-lg transition-all capitalize"
                style={{
                  backgroundColor: filterStatus === f ? "#F9B233" : "transparent",
                  color: filterStatus === f ? "#6B6FA3" : "#6A7181",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: filterStatus === f ? 600 : 400,
                  fontSize: 12,
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "#6B6FA3", textTransform: "uppercase", fontWeight: 600 }}>
          {filteredStudents.length} aluno{filteredStudents.length !== 1 ? "s" : ""} encontrado{filteredStudents.length !== 1 ? "s" : ""}
        </p>

        <div className="flex flex-col gap-3">
          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-xl p-8 flex items-center justify-center" style={{ border: "1px dashed #D7D7D9" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B1B4BD" }}>Nenhum aluno encontrado.</p>
            </div>
          )}
          {filteredStudents.map((student) => {
            const isSaved = saved.has(student.id);
            const media = isSaved ? getStudentMedia(student.id) : "—";
            return (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left w-full"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1.5px solid ${isSaved ? "#05245F" : "#EBEBEB"}` }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: isSaved ? "#E6FAF8" : "#EEF1F8" }}
                >
                  {isSaved
                    ? <CheckCircleIcon className="w-5 h-5" style={{ color: "#05245F" }} />
                    : <UserIcon className="w-5 h-5" style={{ color: "#6B6FA3" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#111" }}>{student.name}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6A7181" }}>Aluno #{student.numero}</p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  {isSaved && (
                    <span className="px-2.5 py-1 rounded-full" style={{ backgroundColor: "#E6FAF8", color: "#05245F", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                      Média: {media}
                    </span>
                  )}
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: isSaved ? "#E6FAF8" : "#FFF8E0",
                      color: isSaved ? "#05245F" : "#B07D00",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {isSaved ? "Corrigido" : "Pendente"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Exam correction view for selected student
  const studentIdx = students.findIndex((s) => s.id === selectedStudent.id);
  const isSaved = saved.has(selectedStudent.id);

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Back + navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedStudentId(null)} className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "#6A7181" }}>
          <ArrowLeftIcon className="w-5 h-5" />
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 14 }}>Voltar para lista</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { const prev = students[studentIdx - 1]; if (prev) setSelectedStudentId(prev.id); }}
            disabled={studentIdx === 0}
            className="p-2 rounded-lg transition-opacity"
            style={{ border: "1px solid #E6E6E6", backgroundColor: "#fff", opacity: studentIdx === 0 ? 0.4 : 1, cursor: studentIdx === 0 ? "not-allowed" : "pointer" }}
          >
            <ChevronLeftIcon className="w-4 h-4" style={{ color: "#6B6FA3" }} />
          </button>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6A7181" }}>
            {studentIdx + 1} / {students.length}
          </span>
          <button
            onClick={() => { const next = students[studentIdx + 1]; if (next) setSelectedStudentId(next.id); }}
            disabled={studentIdx === students.length - 1}
            className="p-2 rounded-lg transition-opacity"
            style={{ border: "1px solid #E6E6E6", backgroundColor: "#fff", opacity: studentIdx === students.length - 1 ? 0.4 : 1, cursor: studentIdx === students.length - 1 ? "not-allowed" : "pointer" }}
          >
            <ChevronRightIcon className="w-4 h-4" style={{ color: "#6B6FA3" }} />
          </button>
        </div>
      </div>

      {/* Student header */}
      <div className="bg-white rounded-xl px-6 py-4 flex items-center justify-between" style={{ border: "1px solid #E6E6E6" }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: "#EEF1F8" }}>
            <UserIcon className="w-5 h-5" style={{ color: "#6B6FA3" }} />
          </div>
          <div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#000" }}>{selectedStudent.name}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6A7181" }}>
              Aluno #{selectedStudent.numero} · {exam.title}
            </p>
          </div>
        </div>
        {isSaved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#E6FAF8", color: "#05245F", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}>
            <CheckCircleIcon className="w-4 h-4" />
            Corrigido · Média {getStudentMedia(selectedStudent.id)}
          </span>
        )}
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-xl p-10 flex items-center justify-center" style={{ border: "1px solid #E6E6E6" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B1B4BD" }}>Nenhuma questão nesta prova.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((question, qi) => {
            const gk = gradeKey(selectedStudent.id, question.id);
            const autoG = autoGrade(selectedStudent, question);
            const currentGrade = grades[gk] ?? autoG;
            const correct = isCorrect(selectedStudent, question);
            const answer = getStudentAnswer(selectedStudent, question);
            const { bg, color } = typeColors[question.type];

            return (
              <div key={question.id} className="bg-white rounded-xl flex flex-col" style={{ border: "1px solid #EBEBEB", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                {/* Question header */}
                <div className="px-5 py-4 flex items-start gap-3" style={{ borderBottom: "1px solid #F2F2F2" }}>
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, backgroundColor: "#EEF1F8" }}>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#6B6FA3" }}>{qi + 1}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: bg, color, fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600 }}>
                        {question.type}
                      </span>
                      {correct !== null && (
                        <span className="px-2 py-0.5 rounded-full" style={{
                          backgroundColor: correct ? "#DCFCE7" : "#FEE2E2",
                          color: correct ? "#16A34A" : "#DC2626",
                          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600
                        }}>
                          {correct ? "✓ Correto" : "✗ Incorreto"}
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111" }}>{question.text}</p>
                  </div>
                </div>

                {/* Answer + grading */}
                <div className="px-5 py-4 flex gap-4">
                  {/* Answer box */}
                  <div className="flex-1 flex flex-col gap-2">
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#6A7181" }}>Resposta do aluno</p>
                    <div className="rounded-xl p-3" style={{ backgroundColor: "#F7F8FA", border: "1px solid #E6E6E6" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111", lineHeight: 1.6 }}>{answer}</p>
                    </div>
                    {/* Correct answer for alternativa/VF */}
                    {question.type === "Alternativa" && (
                      <div className="rounded-xl p-3" style={{ backgroundColor: "#EEF1F8" }}>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B6FA3" }}>
                          <strong>Gabarito:</strong> Alternativa {question.options?.find((o) => o.correct)?.letter} — {question.options?.find((o) => o.correct)?.text}
                        </p>
                      </div>
                    )}
                    {question.type === "V/F" && (
                      <div className="rounded-xl p-3" style={{ backgroundColor: "#EEF1F8" }}>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B6FA3" }}>
                          <strong>Gabarito:</strong> {question.answer}
                        </p>
                      </div>
                    )}
                    {question.type === "Discursiva" && question.answer && (
                      <div className="rounded-xl p-3" style={{ backgroundColor: "#FFF8E0" }}>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#B07D00" }}>
                          <strong>Gabarito esperado:</strong> {question.answer}
                        </p>
                      </div>
                    )}
                    {/* Comment */}
                    {question.type === "Discursiva" && (
                      <textarea
                        rows={2}
                        value={comments[gk] ?? ""}
                        onChange={(e) => handleComment(selectedStudent.id, question.id, e.target.value)}
                        placeholder="Comentário para o aluno (opcional)..."
                        style={{ width: "100%", backgroundColor: "#F2F3F5", border: "1px solid transparent", borderRadius: 8, padding: "8px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, color: "#111", outline: "none", resize: "none" }}
                        onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                      />
                    )}
                  </div>

                  {/* Grade selector */}
                  <div className="flex flex-col gap-2 shrink-0" style={{ width: 120 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#6A7181" }}>Nota</p>
                    {question.type === "Discursiva" ? (
                      <select
                        value={currentGrade === "" ? "—" : currentGrade}
                        onChange={(e) => handleGrade(selectedStudent.id, question.id, e.target.value === "—" ? "" : e.target.value)}
                        style={{ width: "100%", height: 40, backgroundColor: "#F2F3F5", border: "1px solid transparent", borderRadius: 8, padding: "0 12px", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: "#6B6FA3", outline: "none", cursor: "pointer", appearance: "none", textAlign: "center" }}
                        onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
                      >
                        {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    ) : (
                      <div
                        className="flex items-center justify-center rounded-xl"
                        style={{ height: 40, backgroundColor: correct ? "#DCFCE7" : "#FEE2E2", border: `1.5px solid ${correct ? "#16A34A" : "#DC2626"}` }}
                      >
                        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: correct ? "#16A34A" : "#DC2626" }}>
                          {autoG}
                        </span>
                      </div>
                    )}
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#9B9B9B", textAlign: "center" }}>
                      {question.type === "Discursiva" ? "0 a 10" : "Automático"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-between items-center bg-white rounded-xl px-6 py-4 sticky bottom-4" style={{ border: "1px solid #E6E6E6", boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6A7181" }}>
            Média calculada
          </p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#6B6FA3" }}>
            {getStudentMedia(selectedStudent.id)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedStudentId(null)}
            className="px-5 py-2.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ border: "1px solid #E6E6E6", backgroundColor: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#111" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#6B6FA3", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#fff" }}
          >
            <BookmarkIcon className="w-4 h-4" />
            Salvar correção do aluno
          </button>
        </div>
      </div>
    </div>
  );
}
