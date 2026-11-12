export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4002";

type ApiError = { msg: string };

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (Array.isArray(body.errors)) {
      return body.errors.map((e: ApiError) => e.msg).join(". ");
    }
    if (body.error) return body.error;
  } catch {
    /* respuesta sin JSON */
  }
  return `Error del servidor (${res.status})`;
}

export async function getGuitars(): Promise<Guitar[]> {
  const res = await fetch(`${API_URL}/api/guitars`);
  if (!res.ok) throw new Error(await parseError(res));
  const { data } = await res.json();
  // DECIMAL llega como string desde Postgres -> se convierte a número
  return data.map((g: Guitar) => ({ ...g, price: Number(g.price) }));
}

export async function createGuitar(input: GuitarInput): Promise<Guitar> {
  const res = await fetch(`${API_URL}/api/guitars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const { data } = await res.json();
  return { ...data, price: Number(data.price) };
}
