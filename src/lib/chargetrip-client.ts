// src/lib/chargetrip-client.ts
const CHARGETRIP_ENDPOINT = 'https://api.chargetrip.io/graphql';

export async function chargetripQuery(query: string, variables?: Record<string, unknown>) {
  const clientId = import.meta.env.VITE_CHARGETRIP_CLIENT_ID;
  const appId = import.meta.env.VITE_CHARGETRIP_APP_ID;

  if (!clientId || !appId) {
    throw new Error('Chargetrip credentials not found in environment variables');
  }

  // Criar o body exatamente como o playground faz
  const body: { query: string; variables?: Record<string, unknown> } = {
    query,
  };

  // Só adiciona variables se existir
  if (variables) {
    body.variables = variables;
  }

  const response = await fetch(CHARGETRIP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-app-id': appId,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  // Verificar erros GraphQL primeiro (mesmo com status 200 podem ter erros)
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  // Se não tem data, lançar erro
  if (!result.data) {
    throw new Error('No data returned from API');
  }

  return result.data;
}
