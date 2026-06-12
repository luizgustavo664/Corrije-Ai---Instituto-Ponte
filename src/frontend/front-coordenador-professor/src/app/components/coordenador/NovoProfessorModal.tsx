import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfessorData) => void;
}

export interface ProfessorData {
  nome: string;
  cpf: string;
  email: string;
  ingresso: string;
  telefone: string;
  materiaPrincipal: string;
}

export function NovoProfessorModal({ isOpen, onClose, onSave }: Props): JSX.Element | null {
  const [formData, setFormData] = useState<ProfessorData>({
    nome: "",
    cpf: "",
    email: "",
    ingresso: "",
    telefone: "",
    materiaPrincipal: "",
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    setFormData({ nome: "", cpf: "", email: "", ingresso: "", telefone: "", materiaPrincipal: "" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md relative"
        style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2
          className="mb-6"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px", color: "#6B6FA3" }}
        >
          Informações do novo professor
        </h2>

        {/* Campos do formulário */}
        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="nome"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", display: "block", marginBottom: "8px" }}
            >
              Nome:
            </label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                border: "2px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#6B6FA3",
              }}
              placeholder="Professor 1"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", display: "block", marginBottom: "8px" }}
            >
              CPF:
            </label>
            <input
              id="cpf"
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                border: "2px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#6B6FA3",
              }}
              placeholder="xxx.xxx.xxx-xx"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", display: "block", marginBottom: "8px" }}
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                border: "2px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#6B6FA3",
              }}
              placeholder="xxxxxx@gmail.com"
            />
          </div>

          <div>
            <label
              htmlFor="ingresso"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", display: "block", marginBottom: "8px" }}
            >
              Ingresso:
            </label>
            <input
              id="ingresso"
              type="text"
              value={formData.ingresso}
              onChange={(e) => setFormData({ ...formData, ingresso: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                border: "2px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#6B6FA3",
              }}
              placeholder="xx/xx/xx"
            />
          </div>

          <div>
            <label
              htmlFor="telefone"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", display: "block", marginBottom: "8px" }}
            >
              Telefone:
            </label>
            <input
              id="telefone"
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                border: "2px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#6B6FA3",
              }}
              placeholder="xx-xxxxxxxxx"
            />
          </div>

          <div>
            <label
              htmlFor="materiaPrincipal"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6A7181", display: "block", marginBottom: "8px" }}
            >
              Matéria Principal:
            </label>
            <input
              id="materiaPrincipal"
              type="text"
              value={formData.materiaPrincipal}
              onChange={(e) => setFormData({ ...formData, materiaPrincipal: e.target.value })}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                border: "2px solid #D9D9D9",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#6B6FA3",
              }}
              placeholder="xxxxxxxx"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full transition-opacity hover:opacity-85"
            style={{
              backgroundColor: "#D9D9D9",
              color: "#6B6FA3",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            CANCELAR
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-full transition-opacity hover:opacity-85"
            style={{
              backgroundColor: "#F9B233",
              color: "#6B6FA3",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            SALVAR
          </button>
        </div>
      </div>
    </div>
  );
}
