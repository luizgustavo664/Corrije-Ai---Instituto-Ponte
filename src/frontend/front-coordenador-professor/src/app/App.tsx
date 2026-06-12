import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { CadastroScreen } from "./components/CadastroScreen";
import { ProfessorDashboard } from "./components/professor/ProfessorDashboard";
import { CoordenadorDashboard } from "./components/coordenador/CoordenadorDashboard";
import imgLogo from "../imports/logo-new.png";

type Screen = "login" | "cadastro";
type Role = "professor" | "coordenador";
type AppView = "auth" | "professor" | "coordenador";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("professor");
  const [appView, setAppView] = useState<AppView>("auth");

  if (appView === "professor") {
    return <ProfessorDashboard onLogout={() => setAppView("auth")} />;
  }

  if (appView === "coordenador") {
    return <CoordenadorDashboard onLogout={() => setAppView("auth")} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F2F2F2" }}>
      {/* Header */}
      <header
        className="w-full flex flex-col items-center py-16 px-6 text-center"
        style={{ backgroundColor: "#05245F" }}
      >
        {/* Logo card */}
        <div
          className="mb-8 px-8 py-4 rounded-2xl"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)" }}
        >
          <img
            src={imgLogo}
            alt="Corrije Aí"
            style={{ width: 130, height: 150, objectFit: "contain" }}
          />
        </div>
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            color: "#FFFFFF",
            fontSize: "clamp(36px, 6vw, 80px)",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}
        >
          Bem vindo ao Corrije ai
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            color: "#6B6FA3",
            fontSize: "clamp(16px, 2.5vw, 24px)",
          }}
        >
          O sistema de provas do Instituto Ponte
        </p>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center items-start py-12 px-4">
        {screen === "login" ? (
          <LoginScreen
            role={role}
            onRoleChange={setRole}
            onNavigateToCadastro={() => setScreen("cadastro")}
            onLogin={() => setAppView(role)}
          />
        ) : (
          <CadastroScreen
            role={role}
            onRoleChange={setRole}
            onNavigateToLogin={() => setScreen("login")}
          />
        )}
      </main>
    </div>
  );
}