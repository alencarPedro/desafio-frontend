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
        coordinates: [number, number];
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
        coordinates: [number, number];
      };
    };
  }

  export interface RouteResponse {
    id: string;
    status?: string;
  }

  export interface RouteDurations {
    total?: number;
    charging?: number;
    driving?: number;
    stopover?: number;
    ferry?: number;
  }

  export interface RouteLocation {
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
      total_occupant_weight?: number;
      total_cargo_weight?: number;
    }
  }

  export interface RouteSection {
    type?: string;
    distance?: number;
    duration?: number;
    consumption?: number;
    origin?: RouteLocation;
    destination?: RouteLocation;
    tags?: string[];
    polyline?: string;
  }

  export interface RouteLeg {
    type?: string;
    distance?: number;
    durations?: RouteDurations;
    consumption?: number;
    range_at_origin?: number;
    range_at_destination?: number;
    range_after_charge?: number;
    origin?: RouteLocation;
    destination?: RouteLocation;
    station?: {
      station_id?: string;
    };
    polyline?: string;
    tags?: string[];
    sections?: RouteSection[];
  }

  export interface RouteRecommended {
    id?: string;
    charges?: number;
    distance?: number;
    durations?: RouteDurations;
    consumption?: number;
    range_at_origin?: number;
    range_at_destination?: number;
    polyline?: string;
    legs?: RouteLeg[];
    tags?: string[];
  }

  export interface RouteDetails {
    id: string;
    status: string;
    recommended?: RouteRecommended;
    summary?: {
      distance?: number;
      duration?: number;
      consumption?: number;
    };
    polyline?: string;
    waypoints?: Array<{
      location?: {
        coordinates: number[];
      };
    }>;
  }
