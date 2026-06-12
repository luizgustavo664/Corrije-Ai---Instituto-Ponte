import type { Question } from "./ProvaDetailPage";

export interface BancoQuestion {
  id: number;
  type: "Alternativa" | "V/F" | "Discursiva";
  materia: string;
  semestre: string;
  dificuldade: string;
  text: string;
  options?: { letter: string; text: string; correct: boolean }[];
  answer?: string;
  timesUsed: number;
  successRate: number;
}

export const bancoQuestoes: BancoQuestion[] = [
  {
    id: 1,
    type: "Alternativa",
    materia: "Cálculo Avançado",
    semestre: "1º Semestre",
    dificuldade: "Extremamente Difícil",
    text: "Calcule a integral tripla de f(x,y,z) = x²y + 3z sobre a região limitada pelo elipsoide x²/4 + y²/9 + z²/16 ≤ 1",
    options: [
      { letter: "A", text: "∫∫∫ = 256π/15", correct: false },
      { letter: "B", text: "∫∫∫ = 512π/9", correct: true },
      { letter: "C", text: "∫∫∫ = 128π/3", correct: false },
      { letter: "D", text: "∫∫∫ = 1024π/27", correct: false },
    ],
    timesUsed: 8,
    successRate: 45,
  },
  {
    id: 2,
    type: "V/F",
    materia: "Física Quântica",
    semestre: "2º Semestre",
    dificuldade: "Muito Difícil",
    text: "No experimento de dupla fenda, a função de onda colapsa apenas quando um observador consciente realiza a medição, segundo a interpretação de Copenhague da mecânica quântica.",
    answer: "Verdadeiro",
    timesUsed: 12,
    successRate: 58,
  },
  {
    id: 3,
    type: "Discursiva",
    materia: "Teoria da Relatividade",
    semestre: "1º Semestre",
    dificuldade: "Difícil",
    text: "Derive a equação de campo de Einstein a partir do princípio de ação de Hilbert-Einstein e explique como a curvatura do espaço-tempo relaciona-se com a distribuição de energia-momento. Discuta as soluções de Schwarzschild e Kerr.",
    answer: "Gabarito: A derivação inicia-se com a ação S = ∫(R - 2Λ)√-g d⁴x, onde R é o escalar de Ricci. Aplicando o princípio variacional δS/δg_μν = 0, obtemos G_μν + Λg_μν = 8πG/c⁴ T_μν...",
    timesUsed: 5,
    successRate: 32,
  },
  {
    id: 4,
    type: "Alternativa",
    materia: "Química Orgânica",
    semestre: "2º Semestre",
    dificuldade: "Média",
    text: "Qual mecanismo de reação melhor descreve a formação do produto majoritário na reação de cicloadição [4+2] de Diels-Alder entre 1,3-butadieno e dienófilo assimétrico com controle estereoquímico?",
    options: [
      { letter: "A", text: "Mecanismo concertado síncrono com orbital HOMO-LUMO", correct: true },
      { letter: "B", text: "Mecanismo por etapas via carbocátion intermediário", correct: false },
      { letter: "C", text: "Mecanismo radicalítico com propagação em cadeia", correct: false },
      { letter: "D", text: "Mecanismo de substituição nucleofílica SN2", correct: false },
    ],
    timesUsed: 15,
    successRate: 62,
  },
  {
    id: 5,
    type: "Alternativa",
    materia: "Matemática",
    semestre: "1º Semestre",
    dificuldade: "Difícil",
    text: "Qual é o menor número primo de Mersenne maior que 2^82589933 - 1?",
    options: [
      { letter: "A", text: "2^86243729 - 1", correct: false },
      { letter: "B", text: "2^89456123 - 1", correct: false },
      { letter: "C", text: "2^136279841 - 1", correct: true },
      { letter: "D", text: "2^192874561 - 1", correct: false },
    ],
    timesUsed: 6,
    successRate: 38,
  },
  {
    id: 6,
    type: "V/F",
    materia: "Termodinâmica",
    semestre: "2º Semestre",
    dificuldade: "Média",
    text: "A entropia de um sistema isolado em equilíbrio termodinâmico pode ser expressa como S = k_B ln(Ω), onde Ω representa o número de microestados acessíveis ao sistema, segundo a fórmula de Boltzmann.",
    answer: "Verdadeiro",
    timesUsed: 18,
    successRate: 71,
  },
  {
    id: 7,
    type: "Alternativa",
    materia: "Análise Matemática",
    semestre: "1º Semestre",
    dificuldade: "Difícil",
    text: "Calcule o resíduo da função f(z) = (e^z - 1)/(z³sin(z)) no polo de ordem 4 em z = 0",
    options: [
      { letter: "A", text: "Res(f,0) = 1/12", correct: false },
      { letter: "B", text: "Res(f,0) = 1/6", correct: true },
      { letter: "C", text: "Res(f,0) = 1/3", correct: false },
      { letter: "D", text: "Res(f,0) = 2/3", correct: false },
    ],
    timesUsed: 9,
    successRate: 41,
  },
  {
    id: 8,
    type: "Discursiva",
    materia: "Mecânica Quântica",
    semestre: "2º Semestre",
    dificuldade: "Difícil",
    text: "Derive a equação de Schrödinger dependente do tempo a partir dos postulados da mecânica quântica e resolva-a para o potencial de oscilador harmônico quântico tridimensional anisotrópico. Discuta os níveis de energia e funções de onda.",
    answer: "Gabarito: Partindo do operador hamiltoniano H = -ℏ²/2m ∇² + V(r), aplicamos o postulado da evolução temporal iℏ∂ψ/∂t = Hψ. Para o oscilador anisotrópico V = ½m(ω_x²x² + ω_y²y² + ω_z²z²), separamos variáveis ψ = X(x)Y(y)Z(z)...",
    timesUsed: 7,
    successRate: 35,
  },
  {
    id: 9,
    type: "Alternativa",
    materia: "Topologia",
    semestre: "1º Semestre",
    dificuldade: "Difícil",
    text: "Qual é o grupo fundamental π₁ da garrafa de Klein?",
    options: [
      { letter: "A", text: "ℤ", correct: false },
      { letter: "B", text: "⟨a,b | aba⁻¹b = 1⟩", correct: true },
      { letter: "C", text: "ℤ × ℤ", correct: false },
      { letter: "D", text: "{1}", correct: false },
    ],
    timesUsed: 11,
    successRate: 44,
  },
  {
    id: 10,
    type: "V/F",
    materia: "Eletromagnetismo",
    semestre: "2º Semestre",
    dificuldade: "Média",
    text: "As equações de Maxwell em forma covariante podem ser expressas como ∂_μ F^μν = μ₀J^ν e ∂_λ F_μν + ∂_μ F_νλ + ∂_ν F_λμ = 0, onde F^μν é o tensor eletromagnético.",
    answer: "Verdadeiro",
    timesUsed: 14,
    successRate: 68,
  },
  {
    id: 11,
    type: "Discursiva",
    materia: "Geometria Diferencial",
    semestre: "1º Semestre",
    dificuldade: "Difícil",
    text: "Demonstre o teorema de Gauss-Bonnet para superfícies compactas orientáveis em ℝ³ e explique sua relação com a característica de Euler. Forneça exemplos para toro e esfera.",
    answer: "Gabarito: O teorema estabelece que ∫∫_M K dA + ∫_∂M k_g ds = 2πχ(M), onde K é a curvatura Gaussiana, k_g a curvatura geodésica da fronteira e χ a característica de Euler. Para esfera: χ=2, toro: χ=0...",
    timesUsed: 10,
    successRate: 48,
  },
  {
    id: 12,
    type: "Alternativa",
    materia: "Análise Funcional",
    semestre: "2º Semestre",
    dificuldade: "Difícil",
    text: "Seja T: H → H um operador linear limitado auto-adjunto em espaço de Hilbert. Qual afirmação sobre o espectro σ(T) é verdadeira?",
    options: [
      { letter: "A", text: "σ(T) ⊂ ℂ é um conjunto aberto", correct: false },
      { letter: "B", text: "σ(T) ⊂ ℝ e ||T|| = sup{|λ| : λ ∈ σ(T)}", correct: true },
      { letter: "C", text: "σ(T) consiste apenas de autovalores discretos", correct: false },
      { letter: "D", text: "σ(T) = ∅ para todo operador compacto", correct: false },
    ],
    timesUsed: 13,
    successRate: 52,
  },
];

export function convertBancoToQuestion(bancoQ: BancoQuestion): Question {
  return {
    id: bancoQ.id,
    type: bancoQ.type,
    text: bancoQ.text,
    options: bancoQ.options,
    answer: bancoQ.answer,
  };
}
