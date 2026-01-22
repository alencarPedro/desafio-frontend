// src/services/routes.ts
import { chargetripQuery } from '../lib/chargetrip-client';
import type { RouteInput, RouteDetails } from '../types/route';

const CREATE_ROUTE_MUTATION = `
  mutation CreateRoute($input: CreateRouteInput!) {
    createRoute(input: $input)
  }
`;

// Query corrigida usando getRoute conforme o exemplo do playground
const ROUTE_DETAILS_QUERY = `
  query GetRoute($id: ID!) {
    getRoute(id: $id) {
      id
      status
      recommended {
        distance(unit: meter)
        durations {
          total
          charging
          driving
        }
        consumption
        polyline(decimals: five)
      }
    }
  }
`;

/**
 * Cria uma nova rota no Chargetrip
 * Retorna apenas o ID da rota (string)
 */
export async function createRoute(input: RouteInput): Promise<string> {
  const data = await chargetripQuery(
    CREATE_ROUTE_MUTATION,
    { input }
  ) as { createRoute: string };
  return data.createRoute;
}

/**
 * Busca os detalhes de uma rota usando getRoute
 */
export async function getRouteDetails(routeId: string): Promise<RouteDetails | null> {
  try {
    const data = await chargetripQuery(ROUTE_DETAILS_QUERY, { id: routeId }) as {
      getRoute: {
        id: string;
        status: string;
        recommended?: {
          distance?: number;
          durations?: {
            total?: number;
            charging?: number;
            driving?: number;
          };
          consumption?: number;
          polyline?: string;
        };
      };
    };

    if (!data.getRoute) {
      return null;
    }

    const route = data.getRoute;

    // Transformar os dados para o formato esperado
    return {
      id: route.id,
      status: route.status,
      summary: route.recommended
        ? {
            distance: route.recommended.distance,
            duration: route.recommended.durations?.total,
            consumption: route.recommended.consumption,
          }
        : undefined,
      polyline: route.recommended?.polyline,
    } as RouteDetails;
  } catch (error) {
    console.error('Erro ao buscar detalhes da rota:', error);
    return null;
  }
}
