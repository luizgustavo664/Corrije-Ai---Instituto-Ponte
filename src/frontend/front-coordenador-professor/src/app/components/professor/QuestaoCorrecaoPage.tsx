import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, BookmarkIcon, EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

interface Props {
  onBack: () => void;
  questionType?: "Alternativa" | "V/F" | "Discursiva";
  correctAnswer?: string; // Para V/F ou letra da alternativa correta
  onAllCorrected?: () => void;
}

const students = [
  {
    id: 1,
    name: "Lucas Henrique Martins #01",
    answer: "A derivação da equação de campo de Einstein parte do princípio de ação de Hilbert-Einstein, onde a ação é definida como S = ∫(R - 2Λ)√-g d⁴x. Aplicando o cálculo variacional δS/δg_μν = 0, obtemos a equação fundamental G_μν + Λg_μν = 8πG/c⁴ T_μν, onde G_μν é o tensor de Einstein que relaciona a curvatura do espaço-tempo com a distribuição de energia-momento através do tensor T_μν. A solução de Schwarzschild descreve o campo gravitacional de uma massa esférica não rotativa em vácuo, enquanto a solução de Kerr generaliza para corpos em rotação, introduzindo termos adicionais que descrevem o arrasto de referenciais.",
    selectedOption: "B",
    vfAnswer: "Verdadeiro",
  },
  {
    id: 2,
    name: "Isabela Cristina Souza #02",
    answer: "Para resolver a integral tripla de f(x,y,z) = x²y + 3z sobre o elipsoide x²/4 + y²/9 + z²/16 ≤ 1, aplicamos a transformação para coordenadas elípticas com x = 2r sin(θ)cos(φ), y = 3r sin(θ)sin(φ), z = 4r cos(θ). O Jacobiano desta transformação é 24r² sin(θ). Integrando nos limites apropriados: r de 0 a 1, θ de 0 a π, φ de 0 a 2π, obtemos ∫∫∫ f dV = ∫₀¹∫₀^π∫₀^2π [4r³ sin²(θ)cos(φ)sin(φ) + 12r cos(θ)] 24r² sin(θ) dφ dθ dr = 512π/9, considerando que a integral do termo xy se anula por simetria.",
    selectedOption: "A",
    vfAnswer: "Falso",
  },
  {
    id: 3,
    name: "Gabriel Fernando Costa #03",
    answer: "O teorema de Gauss-Bonnet estabelece uma relação profunda entre a geometria local (curvatura) e a topologia global (característica de Euler). Para superfícies compactas orientáveis sem fronteira, temos ∫∫_M K dA = 2πχ(M). Para a esfera, χ = 2, logo ∫∫_S² K dA = 4π. Como a curvatura Gaussiana é constante K = 1/R², obtemos 4πR² · 1/R² = 4π ✓. Para o toro, χ = 0, portanto ∫∫_T² K dA = 0, o que é consistente pois o toro pode ser imerso em ℝ³ com regiões de curvatura positiva e negativa que se cancelam.",
    selectedOption: "C",
    vfAnswer: "Verdadeiro",
  },
  {
    id: 4,
    name: "Beatriz Oliveira Santos #04",
    answer: "A reação de Diels-Alder é uma cicloadição [4+2] que procede via mecanismo concertado síncrono, governado pela interação HOMO-LUMO. O orbital HOMO do dieno (1,3-butadieno) interage com o orbital LUMO do dienófilo em uma única etapa, sem intermediários. A estereoquímica é preservada (reação estereoespecífica): dienófilos cis produzem produtos cis, e trans produzem trans. A regioseletividade é determinada pelos coeficientes dos orbitais moleculares, favorecendo a formação do isômero orto em dienófilos assimétricos com grupos retiradores de elétrons.",
    selectedOption: "B",
    vfAnswer: "Verdadeiro",
  },
  {
    id: 5,
    name: "Pedro Augusto Lima #05",
    answer: "Os números primos de Mersenne têm a forma M_p = 2^p - 1, onde p deve ser primo. Após 2^82589933 - 1 (descoberto em 2018), o próximo primo de Mersenne conhecido é M_136279841 = 2^136279841 - 1, descoberto em 2024 pelo projeto GIMPS (Great Internet Mersenne Prime Search). Este número possui 41.024.320 dígitos decimais. A busca por primos de Mersenne utiliza o teste de Lucas-Lehmer, que é particularmente eficiente para números desta forma.",
    selectedOption: "D",
    vfAnswer: "Falso",
  },
  {
    id: 6,
    name: "Mariana Silva Alves #06",
    answer: "A fórmula de Boltzmann S = k_B ln(Ω) é verdadeira e fundamental na mecânica estatística. Ela relaciona a entropia macroscópica S de um sistema com o número de microestados acessíveis Ω, onde k_B ≈ 1.38×10⁻²³ J/K é a constante de Boltzmann. Esta equação conecta a termodinâmica macroscópica com a mecânica estatística microscópica, mostrando que sistemas tendem a evoluir para estados com maior número de microestados (maior entropia), consistente com a segunda lei da termodinâmica. Para um sistema isolado em equilíbrio, todos os microestados com mesma energia são equiprováveis.",
    selectedOption: "A",
    vfAnswer: "Verdadeiro",
  },
  {
    id: 7,
    name: "Rafael dos Santos Rocha #07",
    answer: "Para calcular o resíduo em z = 0, primeiro identificamos a ordem do polo analisando o comportamento das expansões em série. f(z) = (e^z - 1)/(z³sin(z)). Usando e^z - 1 ≈ z + z²/2 + z³/6 + ... e sin(z) ≈ z - z³/6 + ..., temos f(z) ≈ (z + z²/2 + ...)/(z⁴ - z⁶/6 + ...) = (1 + z/2 + ...)/z³(1 - z²/6 + ...). Expandindo em série de Laurent e identificando o coeficiente de 1/z, obtemos Res(f,0) = 1/6.",
    selectedOption: "B",
    vfAnswer: "Falso",
  },
  {
    id: 8,
    name: "Amanda Carolina Dias #08",
    answer: "A equação de Schrödinger dependente do tempo iℏ∂ψ/∂t = Hψ deriva do postulado da evolução temporal. Para o oscilador harmônico anisotrópico 3D, V = ½m(ω_x²x² + ω_y²y² + ω_z²z²), separamos variáveis ψ = X(x)Y(y)Z(z)T(t). Cada componente satisfaz a equação do oscilador harmônico 1D. As energias são E_n = ℏ(ω_x(n_x + ½) + ω_y(n_y + ½) + ω_z(n_z + ½)), onde n_x, n_y, n_z = 0,1,2,... As funções de onda são produtos de polinômios de Hermite com exponenciais gaussianas.",
    selectedOption: "C",
    vfAnswer: "Verdadeiro",
  },
  {
    id: 9,
    name: "Thiago Roberto Freitas #09",
    answer: "O grupo fundamental da garrafa de Klein é π₁(K) = ⟨a,b | aba⁻¹b = 1⟩. Este grupo é não-abeliano, diferentemente do toro (ℤ × ℤ). A relação aba⁻¹b = 1 pode ser reescrita como aba⁻¹ = b⁻¹, mostrando que a conjugação de b por a inverte b. Isto reflete a propriedade não-orientável da garrafa de Klein: ao percorrer o caminho a, o laço b tem sua orientação invertida. O grupo não é isomorfo a ℤ nem ao grupo trivial {1}.",
    selectedOption: "A",
    vfAnswer: "Falso",
  },
  {
    id: 10,
    name: "Julia Fernanda Rodrigues #10",
    answer: "As equações de Maxwell em forma covariante são ∂_μ F^μν = μ₀J^ν (equação de Maxwell-Ampère) e ∂_λ F_μν + ∂_μ F_νλ + ∂_ν F_λμ = 0 (identidade de Bianchi). O tensor eletromagnético F^μν é antissimétrico e contém os campos elétrico e magnético: F^0i = E^i/c e F^ij = ε^ijk B_k. Estas equações são manifestamente covariantes sob transformações de Lorentz, unificando eletricidade e magnetismo em uma estrutura geométrica do espaço-tempo de Minkowski.",
    selectedOption: "B",
    vfAnswer: "Verdadeiro",
  },
  {
    id: 11,
    name: "Carlos Eduardo Pereira #11",
    answer: "O teorema de Gauss-Bonnet ∫∫_M K dA + ∫_∂M k_g ds = 2πχ(M) conecta geometria e topologia. Para a esfera S²: χ(S²) = 2, K = 1/R² constante, sem fronteira. Assim, 4πR² · 1/R² = 4π = 2π·2 ✓. Para o toro T²: χ(T²) = 0. O toro pode ser parametrizado com curvatura Gaussiana variando de positiva (parte externa) a negativa (parte interna), com integral total zero. A característica de Euler é um invariante topológico: χ = V - E + F = 2 para esfera, 0 para toro.",
    selectedOption: "C",
    vfAnswer: "Falso",
  },
  {
    id: 12,
    name: "Fernanda Oliveira Castro #12",
    answer: "Para operador T: H → H auto-adjunto (T = T*), o espectro σ(T) ⊂ ℝ é real. O teorema espectral garante que ||T|| = sup{|λ| : λ ∈ σ(T)}, conhecido como raio espectral. O espectro é sempre fechado (não aberto). Para operadores compactos, σ(T)\\{0} consiste apenas de autovalores com multiplicidade finita, mas o ponto 0 pode estar no espectro contínuo. Portanto, a afirmação correta é B: σ(T) ⊂ ℝ e ||T|| = sup{|λ| : λ ∈ σ(T)}.",
    selectedOption: "B",
    vfAnswer: "Verdadeiro",
  },
];

const gradeOptions = ["0 a 10", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export function QuestaoCorrecaoPage({ onBack, questionType = "Discursiva", correctAnswer, onAllCorrected }: Props) {
  const [currentStudent, setCurrentStudent] = useState(0);
  const [corrected, setCorrected] = useState<Set<number>>(new Set());
  const [grades, setGrades] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [hideNames, setHideNames] = useState(false);

  const student = students[currentStudent];
  const totalStudents = students.length;
  const correctedCount = corrected.size;

  // Calcular nota automática para questões objetivas
  const getAutoGrade = (studentId: number): string => {
    if (questionType === "Discursiva") return grades[studentId] ?? "0 a 10";

    const s = students.find(st => st.id === studentId);
    if (!s) return "0";

    let isCorrect = false;
    if (questionType === "Alternativa") {
      isCorrect = s.selectedOption === correctAnswer;
    } else if (questionType === "V/F") {
      isCorrect = s.vfAnswer === correctAnswer;
    }

    return isCorrect ? "10" : "0";
  };

  // Auto-aplicar nota para questões objetivas quando mudar de aluno
  useEffect(() => {
    if (questionType !== "Discursiva" && !grades[student.id]) {
      const autoGrade = getAutoGrade(student.id);
      setGrades((prev) => ({ ...prev, [student.id]: autoGrade }));
    }
  }, [currentStudent, questionType, student.id, grades]);

  function goNext() {
    if (currentStudent < totalStudents - 1) setCurrentStudent((p) => p + 1);
  }

  function goPrev() {
    if (currentStudent > 0) setCurrentStudent((p) => p - 1);
  }

  function saveAndAdvance() {
    // Para questões objetivas, salvar a nota automática
    if (questionType !== "Discursiva") {
      const autoGrade = getAutoGrade(student.id);
      setGrades((prev) => ({ ...prev, [student.id]: autoGrade }));
    }
    setCorrected((prev) => new Set([...prev, student.id]));

    // Verificar se é o último aluno
    const isLastStudent = currentStudent === totalStudents - 1;
    if (isLastStudent && onAllCorrected) {
      onAllCorrected();
    } else {
      goNext();
    }
  }

  const progress = Math.round((correctedCount / totalStudents) * 100);

  return (
    <div className="p-8 flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-wrap">
        {["Correção", "Avaliação Final - Cálculo Diferencial III — 1º Semestre 2026", "Questão 7: Integral Tripla em Elipsoide"].map((crumb, i, arr) => (
          <div key={crumb} className="flex items-center gap-2">
            <button
              onClick={i === 0 ? onBack : undefined}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: i === arr.length - 1 ? "#111" : "#6A7181",
                fontWeight: i === arr.length - 1 ? 600 : 400,
                cursor: i === 0 ? "pointer" : "default",
              }}
              className={i === 0 ? "hover:opacity-70 transition-opacity" : ""}
            >
              {crumb}
            </button>
            {i < arr.length - 1 && <ChevronRightIcon className="w-3.5 h-3.5" style={{ color: "#B1B4BD" }} />}
          </div>
        ))}
      </div>

      {/* Title row + navigation */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#000" }}>
            Questão 7: Integral Tripla em Elipsoide
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6B6B" }}>
            Calcule a integral tripla de f(x,y,z) = x²y + 3z sobre a região limitada pelo elipsoide x²/4 + y²/9 + z²/16 ≤ 1
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Toggle ocultar nome */}
          <button
            onClick={() => setHideNames((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            title={hideNames ? "Mostrar nomes dos alunos" : "Ocultar nomes para correção justa"}
            style={{
              border: `1.5px solid ${hideNames ? "#05245F" : "#E6E6E6"}`,
              backgroundColor: hideNames ? "#E6FAF8" : "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: hideNames ? "#05245F" : "#6B6B6B",
              cursor: "pointer",
            }}
          >
            {hideNames
              ? <EyeIcon className="w-4 h-4" />
              : <EyeSlashIcon className="w-4 h-4" />}
            {hideNames ? "Mostrar nomes" : "Ocultar nomes"}
          </button>
          <button
            onClick={goPrev}
            disabled={currentStudent === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-opacity"
            style={{
              border: "1px solid #D7D7D9",
              backgroundColor: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: currentStudent === 0 ? "#B1B4BD" : "#111",
              opacity: currentStudent === 0 ? 0.5 : 1,
              cursor: currentStudent === 0 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Questão anterior
          </button>
          <button
            onClick={goNext}
            disabled={currentStudent === totalStudents - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-opacity"
            style={{
              border: "1px solid #D7D7D9",
              backgroundColor: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: currentStudent === totalStudents - 1 ? "#B1B4BD" : "#111",
              opacity: currentStudent === totalStudents - 1 ? 0.5 : 1,
              cursor: currentStudent === totalStudents - 1 ? "not-allowed" : "pointer",
            }}
          >
            Próxima questão
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress card */}
      <div
        className="bg-white rounded-xl p-4 flex flex-col gap-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #EBEBEB" }}
      >
        <div className="flex items-center justify-between">
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#111" }}>
            Progresso desta questão
          </p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#6B6FA3" }}>
            {correctedCount}/{totalStudents} corrigidas
          </p>
        </div>

        <div className="w-full rounded-full h-2" style={{ backgroundColor: "#E5E7EB" }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: "#6B6FA3" }}
          />
        </div>

        {/* Student pills */}
        <div className="flex gap-2 flex-wrap">
          {students.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStudent(i)}
              title={hideNames ? `Aluno #${String(i + 1).padStart(2, "0")}` : s.name}
              className="flex items-center justify-center rounded-lg transition-all hover:opacity-85"
              style={{
                width: 36,
                height: 28,
                backgroundColor: i === currentStudent ? "#6B6FA3" : corrected.has(s.id) ? "#05245F" : "#E5E7EB",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  color: i === currentStudent || corrected.has(s.id) ? "#fff" : "#6A7181",
                }}
              >
                #{String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Student answer card */}
      <div
        className="bg-white rounded-xl flex flex-col"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #EBEBEB" }}
      >
        {/* Card header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #EBEBEB" }}>
          <div className="flex items-center gap-3">
            {hideNames ? (
              <>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, backgroundColor: "#EEF1F8" }}
                >
                  <EyeSlashIcon className="w-4 h-4" style={{ color: "#6B6FA3" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#000" }}>
                    Aluno #{String(currentStudent + 1).padStart(2, "0")}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#9B9B9B" }}>
                    Nome oculto para correção justa
                  </p>
                </div>
              </>
            ) : (
              <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#000" }}>
                {student.name}
              </p>
            )}
          </div>
        </div>

        {/* Answer section */}
        <div className="px-6 py-5 flex flex-col gap-4" style={{ borderBottom: "1px solid #EBEBEB" }}>
          {/* Answer box */}
          {questionType === "Alternativa" ? (
            <div className="rounded-xl p-4" style={{ backgroundColor: "#EAECF0" }}>
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#111" }}>
                  Resposta do Aluno
                </p>
                {student.selectedOption === correctAnswer ? (
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#16A34A", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                    ✓ Correto
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                    ✗ Incorreto
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: student.selectedOption === correctAnswer ? "#16A34A" : "#DC2626",
                  }}
                >
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>
                    {student.selectedOption}
                  </span>
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#504F4F", fontWeight: 600 }}>
                    Alternativa {student.selectedOption}
                  </p>
                  {student.selectedOption !== correctAnswer && (
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#16A34A", marginTop: 4 }}>
                      Resposta correta: {correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : questionType === "V/F" ? (
            <div className="rounded-xl p-4" style={{ backgroundColor: "#EAECF0" }}>
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#111" }}>
                  Resposta do Aluno
                </p>
                {student.vfAnswer === correctAnswer ? (
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#16A34A", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                    ✓ Correto
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                    ✗ Incorreto
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0 px-4"
                  style={{
                    height: 48,
                    backgroundColor: student.vfAnswer === correctAnswer ? "#16A34A" : "#DC2626",
                  }}
                >
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>
                    {student.vfAnswer}
                  </span>
                </div>
                {student.vfAnswer !== correctAnswer && (
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#16A34A" }}>
                    Resposta correta: {correctAnswer}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4" style={{ backgroundColor: "#EAECF0" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#111", marginBottom: 8 }}>
                Resposta do Aluno
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#504F4F", lineHeight: 1.6 }}>
                {student.answer}
              </p>
            </div>
          )}

          {/* Attachments */}
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#575555", marginBottom: 10 }}>
              Anexos enviados pelo aluno
            </p>
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl flex items-center justify-center shrink-0"
                  style={{ width: 120, height: 80, backgroundColor: "#E5E7EB" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#B1B4BD"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grading section */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {questionType !== "Discursiva" && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "#EEF1F8", border: "1px solid #D7E3FC" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B6FA3", fontWeight: 500 }}>
                ℹ️ Correção automática: A nota é atribuída automaticamente com base na resposta do aluno
              </p>
            </div>
          )}
          <div className="flex gap-5 items-start">
            {/* Grade */}
            <div className="flex flex-col gap-2" style={{ width: 200 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#111" }}>
                Nota (0 - 10)
              </p>
              {questionType === "Discursiva" ? (
                <div className="relative">
                  <select
                    value={grades[student.id] ?? "0 a 10"}
                    onChange={(e) => setGrades((prev) => ({ ...prev, [student.id]: e.target.value }))}
                    className="w-full appearance-none rounded-xl pr-9 pl-3 outline-none cursor-pointer"
                    style={{
                      height: 44,
                      border: "1.5px solid #D7D7D9",
                      backgroundColor: "#fff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      color: "#111",
                    }}
                  >
                    {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#6B6B6B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    height: 44,
                    border: "1.5px solid #D7D7D9",
                    backgroundColor: getAutoGrade(student.id) === "10" ? "#DCFCE7" : "#FEE2E2",
                  }}
                >
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: getAutoGrade(student.id) === "10" ? "#16A34A" : "#DC2626" }}>
                    {getAutoGrade(student.id)}
                  </p>
                </div>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2 flex-1">
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#111" }}>
                Comentário para o aluno
              </p>
              <textarea
                rows={3}
                placeholder="Digite aqui seu feedback...."
                value={comments[student.id] ?? ""}
                onChange={(e) => setComments((prev) => ({ ...prev, [student.id]: e.target.value }))}
                style={{
                  width: "100%",
                  backgroundColor: "#F2F3F5",
                  border: "1px solid transparent",
                  borderRadius: 8,
                  padding: "10px 13px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#111",
                  outline: "none",
                  resize: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#05245F"; e.target.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.backgroundColor = "#F2F3F5"; }}
              />
            </div>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={goPrev}
              disabled={currentStudent === 0}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: currentStudent === 0 ? "#B1B4BD" : "#6A7181",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: currentStudent === 0 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={saveAndAdvance}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full hover:opacity-85 transition-opacity"
              style={{
                backgroundColor: "#6B6FA3",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: "#fff",
              }}
            >
              <BookmarkIcon className="w-4 h-4" style={{ color: "#fff" }} />
              {questionType === "Discursiva" ? "Salvar e Avançar" : "Confirmar e Avançar"}
            </button>

            <button
              onClick={goNext}
              disabled={currentStudent === totalStudents - 1}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: currentStudent === totalStudents - 1 ? "#B1B4BD" : "#6A7181",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: currentStudent === totalStudents - 1 ? "not-allowed" : "pointer",
              }}
            >
              Próximo
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
