import { EnvelopeIcon } from "@heroicons/react/24/outline";
import imgLock from "../../imports/TelaDeAcessoLogin/7e7a81d80b09b6a41757199595b111faa4ac1641.png";

type Role = "professor" | "coordenador";

interface Props {
  role: Role;
  onRoleChange: (role: Role) => void;
  onNavigateToCadastro: () => void;
  onLogin?: () => void;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.18-.68z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function LoginScreen({ role, onRoleChange, onNavigateToCadastro, onLogin }: Props) {
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
            className="px-6 py-2 rounded-full transition-all capitalize"
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
        Login
      </p>

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

      {/* Action buttons row */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onLogin}
          className="flex-1 py-3 rounded-full transition-opacity hover:opacity-85"
          style={{
            backgroundColor: "#F9B233",
            color: "#6B6FA3",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            minWidth: "120px",
          }}
        >
          ENTRAR
        </button>
        <button
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full transition-opacity hover:opacity-85"
          style={{
            backgroundColor: "#D9D9D9",
            color: "#6B6FA3",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
          }}
        >
          <GoogleIcon />
          Entrar com o Google
        </button>
      </div>

      {/* Divider line */}
      <div style={{ borderTop: "1px solid #E5E7EB" }} />

      {/* Cadastro area */}
      <div className="flex flex-col items-center gap-3">
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", color: "#000000" }}>
          Não tem uma conta?{" "}
          <button
            onClick={onNavigateToCadastro}
            className="hover:underline"
            style={{ color: "#05245F", fontFamily: "Inter, sans-serif", fontSize: "16px" }}
          >
            Cadastre-se agora
          </button>
        </p>
        <button
          onClick={onNavigateToCadastro}
          className="px-10 py-3 rounded-full transition-opacity hover:opacity-85"
          style={{
            backgroundColor: "#D9D9D9",
            color: "#6B6FA3",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
          }}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}