import { EnvelopeIcon } from "@heroicons/react/24/outline";
import imgUserMale from "../../imports/TelaDeAcessoCadastro/ca3d333c113637239a6568a73890a91ccb91075a.png";
import imgLock from "../../imports/TelaDeAcessoCadastro/7e7a81d80b09b6a41757199595b111faa4ac1641.png";

type Role = "professor" | "coordenador";

interface Props {
  role: Role;
  onRoleChange: (role: Role) => void;
  onNavigateToLogin: () => void;
}

export function CadastroScreen({ role, onRoleChange, onNavigateToLogin }: Props) {
  return (
    <div
      className="bg-white rounded-2xl w-full max-w-[480px] px-10 py-10 flex flex-col gap-5"
      style={{ boxShadow: "0px 4px 24px rgba(0,0,0,0.10)" }}
    >
      {/* Role selector */}
      <div
        className="flex self-center rounded-full p-1"
        style={{ backgroundColor: "#EEF1F8" }}
      >
        {(["professor", "coordenador"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => onRoleChange(r)}
            className="px-6 py-2 rounded-full transition-all"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              backgroundColor: role === r ? "#6B6FA3" : "transparent",
              color: role === r ? "#FFFFFF" : "#6B6FA3",
            }}
          >
            {r === "professor" ? "Professor" : "Coordenador"}
          </button>
        ))}
      </div>

      {/* Section title */}
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "24px",
          color: "#6B6FA3",
        }}
      >
        Cadastro
      </p>

      {/* Nome input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <img
            src={imgUserMale}
            alt="user"
            className="w-[30px] h-[30px] object-contain opacity-60"
          />
        </div>
        <input
          type="text"
          placeholder="Nome"
          className="w-full pl-12 pr-4 py-4 rounded-sm outline-none transition-colors"
          style={{
            border: "2.5px solid #D9D9D9",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#9F9F9F",
            backgroundColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#05245F")}
          onBlur={(e) => (e.target.style.borderColor = "#D9D9D9")}
        />
      </div>

      {/* Email input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9F9F9F" }}>
          <EnvelopeIcon className="w-[22px] h-[22px]" />
        </div>
        <input
          type="email"
          placeholder="email@email.com.br"
          className="w-full pl-11 pr-4 py-4 rounded-sm outline-none transition-colors"
          style={{
            border: "2.5px solid #D9D9D9",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#9F9F9F",
            backgroundColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#05245F")}
          onBlur={(e) => (e.target.style.borderColor = "#D9D9D9")}
        />
      </div>

      {/* CPF input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <img
            src={imgLock}
            alt="lock"
            className="w-[28px] h-[28px] object-contain opacity-60"
          />
        </div>
        <input
          type="text"
          placeholder="CPF"
          className="w-full pl-12 pr-4 py-4 rounded-sm outline-none transition-colors"
          style={{
            border: "2.5px solid #D9D9D9",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#6B6FA3",
            backgroundColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#05245F")}
          onBlur={(e) => (e.target.style.borderColor = "#D9D9D9")}
        />
      </div>

      {/* Cadastrar button */}
      <button
        className="py-3 rounded-full transition-opacity hover:opacity-85"
        style={{
          backgroundColor: "#F9B233",
          color: "#6B6FA3",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "16px",
        }}
      >
        Cadastrar
      </button>

      {/* Back to login */}
      <p className="text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6B7280" }}>
        Já tem uma conta?{" "}
        <button
          onClick={onNavigateToLogin}
          className="hover:underline"
          style={{ color: "#05245F", fontFamily: "Inter, sans-serif", fontSize: "14px" }}
        >
          Fazer login
        </button>
      </p>
    </div>
  );
}