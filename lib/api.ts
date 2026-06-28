import type { SimulationParams } from "@/types/simulation";

export type CreateSimulationResponse = {
  id: string;
  url: string;
  expiresAt: string;
};

export type GetSimulationResponse = {
  id: string;
  params: SimulationParams;
  createdAt: string;
  expiresAt: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function createSimulation(
  params: SimulationParams,
): Promise<CreateSimulationResponse> {
  const response = await fetch("/api/simulations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ params }),
  });

  return parseJson<CreateSimulationResponse>(response);
}

export async function getSimulation(
  id: string,
): Promise<GetSimulationResponse> {
  const response = await fetch(`/api/simulations/${id}`);
  return parseJson<GetSimulationResponse>(response);
}
