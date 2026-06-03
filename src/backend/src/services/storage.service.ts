type UploadInput = {
  path: string;
  content: string | Buffer;
  contentType: string;
};

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

/**
 * Upload de arquivos para o Supabase Storage.
 *
 * Se as variáveis de ambiente SUPABASE_STORAGE_URL ou
 * SUPABASE_SERVICE_ROLE_KEY não estiverem configuradas,
 * retorna um caminho local simulado (fallback para dev/test).
 */
export class StorageService {
  /**
   * Faz upload de um arquivo para o Supabase Storage.
   *
   * @param input.path - Caminho de destino no bucket (ex.: "provas/{id}/resultados-{timestamp}.csv").
   * @param input.content - Conteúdo do arquivo (string ou Buffer).
   * @param input.contentType - Tipo MIME do arquivo.
   * @returns URL pública do arquivo no storage, ou caminho local simulado em dev/test quando sem config.
   * @throws Error - Se a requisição HTTP ao Supabase Storage falhar.
   */
  async upload({ path, content, contentType }: UploadInput) {
    const storageUrl = process.env.SUPABASE_STORAGE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "exports";

    if (!storageUrl || !serviceKey) {
      return `/${bucket}/${path}`;
    }

    const baseUrl = normalizeBaseUrl(storageUrl);
    const objectPath = path.replace(/^\/+/, "");
    const uploadUrl = `${baseUrl}/storage/v1/object/${bucket}/${objectPath}`;

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body: content as unknown as BodyInit,
    });

    if (!response.ok) {
      throw new Error(`Falha ao enviar arquivo para o storage: ${response.status} ${await response.text()}`);
    }

    return `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
  }
}
