import { apiRequest, apiUpload } from "../../lib/apiClient";
import type {
  EnvioFinalDto,
  IniciarProvaPayload,
  ProvaIniciadaDto,
  ProvaPublicaDto,
  RespostaAlunoDto,
  RespostaSalvaDto,
  SalvarRespostaPayload,
} from "./aluno.types";

function encodeUrlAcesso(urlAcesso: string) {
  return encodeURIComponent(urlAcesso);
}

export function getProvaPublica(urlAcesso: string) {
  return apiRequest<ProvaPublicaDto>(`/public/provas/${encodeUrlAcesso(urlAcesso)}`);
}

export function iniciarProva(urlAcesso: string, payload: IniciarProvaPayload) {
  return apiRequest<ProvaIniciadaDto>(`/public/provas/${encodeUrlAcesso(urlAcesso)}/iniciar`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listarRespostas(provaAlunoId: string) {
  return apiRequest<RespostaAlunoDto[]>(`/public/provas-aluno/${provaAlunoId}/respostas`);
}

export function salvarResposta(
  provaAlunoId: string,
  questaoId: string,
  payload: SalvarRespostaPayload,
) {
  return apiRequest<RespostaSalvaDto>(`/public/provas-aluno/${provaAlunoId}/respostas/${questaoId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function enviarProva(provaAlunoId: string) {
  return apiRequest<EnvioFinalDto>(`/public/provas-aluno/${provaAlunoId}/enviar`, {
    method: "POST",
    body: JSON.stringify({ confirmarEnvio: true }),
  });
}

export type AnexoUploadDto = {
  id: string;
  urlArquivo: string;
  mimeType: string;
  tamanhoBytes: number;
};

export async function uploadAnexo(respostaId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiUpload<AnexoUploadDto>(`/public/respostas/${respostaId}/anexos`, formData);
}
