// src/types/route.ts

export interface RouteInput {
    vehicle: {
      id: string;
      battery?: {
        state_of_charge: {
          value: number;
          type: 'percentage' | 'kwh';
        };
      };
      climate?: boolean;
    };
    origin: {
      type: 'Feature';
      properties: {
        location: {
          name: string;
        };
        vehicle?: {
          occupants?: number;
        };
      };
      geometry: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
    destination: {
      type: 'Feature';
      properties: {
        location: {
          name: string;
        };
      };
      geometry: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
  }

  export interface RouteResponse {
    id: string;
    status?: string;
  }

  export interface RouteDetails {
    id: string;
    status: string;
    summary?: {
      distance?: number; // em metros
      duration?: number; // em segundos
      consumption?: number; // em kWh
    };
    polyline?: string; // polyline da rota para desenhar no mapa
    waypoints?: Array<{
      location?: {
        coordinates: number[];
      };
    }>;
  }
