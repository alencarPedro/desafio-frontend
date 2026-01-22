// src/hooks/useRoute.ts
import { useState } from 'react';
import { createRoute, getRouteDetails } from '../services/routes';
import type { RouteInput, RouteDetails } from '../types/route';

export function useRoute() {
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async (input: RouteInput) => {
    setLoading(true);
    setError(null);
    setRoute(null);

    try {
      // 1. Criar a rota (mutation) - retorna apenas o ID
      const routeId = await createRoute(input);

      // 2. Aguardar um pouco e buscar os detalhes
      // Nota: Em produção, você usaria subscription para aguardar o status "done"
      // Por enquanto, vamos fazer polling simples
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Buscar detalhes da rota usando o ID retornado
      const routeDetails = await getRouteDetails(routeId);

      if (routeDetails) {
        setRoute(routeDetails);
      } else {
        throw new Error('Não foi possível obter os detalhes da rota');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular rota';
      setError(errorMessage);
      console.error('Erro ao calcular rota:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    route,
    loading,
    error,
    calculateRoute,
  };
}
