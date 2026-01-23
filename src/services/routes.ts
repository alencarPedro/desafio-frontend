import { chargetripQuery } from '../lib/chargetrip-client';
import type { RouteInput, RouteDetails } from '../types/route';

const CREATE_ROUTE_MUTATION = `
  mutation CreateRoute($input: CreateRouteInput!) {
    createRoute(input: $input)
  }
`;

const ROUTE_DETAILS_QUERY = `
  query GetRoute($id: ID!) {
    getRoute(id: $id) {
      id
      status
      recommended {
        id
        charges
        distance(unit: meter)
        durations {
          total
          charging
          driving
          stopover
          ferry
        }
        consumption
        range_at_origin(unit: kilometer)
        range_at_destination(unit: kilometer)
        polyline(decimals: five)
        legs {
          type
          distance(unit: meter)
          durations {
            total
            charging
            driving
            stopover
            ferry
          }
          consumption
          range_at_origin(unit: kilometer)
          range_at_destination(unit: kilometer)
          range_after_charge(unit: kilometer)
          origin {
            type
            geometry {
              type
              coordinates
            }
            properties {
              name
              station_id
              external_station_id
              duration
              occupants
            }
          }
          destination {
            type
            geometry {
              type
              coordinates
            }
            properties {
              name
              station_id
              external_station_id
              duration
              occupants
            }
          }
          station {
            station_id
          }
          polyline(decimals: five)
          tags
          sections {
            type
            distance(unit: meter)
            duration
            consumption
            origin {
              type
              geometry {
                type
                coordinates
              }
              properties {
                occupants
              }
            }
            destination {
              type
              geometry {
                type
                coordinates
              }
              properties {
                occupants
              }
            }
            tags
            polyline(decimals: five)
          }
        }
        tags
      }
    }
  }
`;


export async function createRoute(input: RouteInput): Promise<string> {
  const data = await chargetripQuery(
    CREATE_ROUTE_MUTATION,
    { input }
  ) as { createRoute: string };
  return data.createRoute;
}

export async function getRouteDetails(routeId: string): Promise<RouteDetails | null> {
  try {
    const data = await chargetripQuery(ROUTE_DETAILS_QUERY, { id: routeId }) as {
      getRoute: {
        id: string;
        status: string;
        recommended?: {
          id?: string;
          charges?: number;
          distance?: number;
          durations?: {
            total?: number;
            charging?: number;
            driving?: number;
            stopover?: number;
            ferry?: number;
          };
          consumption?: number;
          range_at_origin?: number;
          range_at_destination?: number;
          polyline?: string;
          legs?: Array<{
            type?: string;
            distance?: number;
            durations?: {
              total?: number;
              charging?: number;
              driving?: number;
              stopover?: number;
              ferry?: number;
            };
            consumption?: number;
            range_at_origin?: number;
            range_at_destination?: number;
            range_after_charge?: number;
            origin?: {
              type: string;
              geometry: {
                type: string;
                coordinates: [number, number];
              };
              properties: {
                name?: string;
                station_id?: string;
                external_station_id?: string;
                duration?: number;
                occupants?: number;
              };
            };
            destination?: {
              type: string;
              geometry: {
                type: string;
                coordinates: [number, number];
              };
              properties: {
                name?: string;
                station_id?: string;
                external_station_id?: string;
                duration?: number;
                occupants?: number;
              };
            };
            station?: {
              station_id?: string;
            };
            polyline?: string;
            tags?: string[];
            sections?: Array<{
              type?: string;
              distance?: number;
              duration?: number;
              consumption?: number;
              origin?: {
                type: string;
                geometry: {
                  type: string;
                  coordinates: [number, number];
                };
                properties: {
                  occupants?: number;
                };
              };
              destination?: {
                type: string;
                geometry: {
                  type: string;
                  coordinates: [number, number];
                };
                properties: {
                  occupants?: number;
                };
              };
              tags?: string[];
              polyline?: string;
            }>;
          }>;
          tags?: string[];
        };
      };
    };

    if (!data.getRoute) {
      return null;
    }

    const route = data.getRoute;

    return {
      id: route.id,
      status: route.status,
      recommended: route.recommended,
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
