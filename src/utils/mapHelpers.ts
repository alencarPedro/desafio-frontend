import maplibregl from 'maplibre-gl';
import type { RouteDetails } from '../types/route';
import { decodePolyline } from './polyline';

export interface MapMarker {
  coordinates: [number, number];
  color: string;
  label: string;
  type: 'origin' | 'destination' | 'charging_station';
  chargingDuration?: number;
  stationId?: string;
}

export type MarkerType = 'origin' | 'destination' | 'charging_station';

export function createMarkerElement(
  color: string,
  label?: string,
  type: MarkerType = 'origin'
): HTMLDivElement {
  const el = document.createElement('div');
  el.className = `custom-marker custom-marker-${type}`;

  el.style.cssText = '';

  el.style.cursor = 'pointer';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
  el.style.border = '3px solid white';
  el.style.backgroundColor = color;

  if (type === 'charging_station') {
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.borderRadius = '8px';
    el.style.fontSize = '18px';
    el.style.fontWeight = 'bold';
    el.style.color = 'white';
    el.innerHTML = '⚡';
  } else if (type === 'origin') {
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.innerHTML = '';
  } else if (type === 'destination') {
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.innerHTML = '';
  }

  if (label) {
    el.title = label;
    el.setAttribute('aria-label', label);
  }

  return el;
}

export function createMarker(
  map: maplibregl.Map,
  coordinates: [number, number],
  color: string,
  label?: string,
  type: MarkerType = 'origin'
): maplibregl.Marker {
  const el = createMarkerElement(color, label, type);
  return new maplibregl.Marker(el).setLngLat(coordinates).addTo(map);
}

export function extractMarkersFromRoute(
  route: RouteDetails,
  origin?: { coordinates: [number, number]; name?: string } | null,
  destination?: { coordinates: [number, number]; name?: string } | null
): MapMarker[] {
  const markers: MapMarker[] = [];
  const chargingStations = new Set<string>();

  if (origin?.coordinates) {
    markers.push({
      coordinates: origin.coordinates,
      color: '#10b981',
      label: origin.name || 'Origem',
      type: 'origin',
    });
  }

  if (destination?.coordinates) {
    markers.push({
      coordinates: destination.coordinates,
      color: '#ef4444',
      label: destination.name || 'Destino',
      type: 'destination',
    });
  }

  if (route.recommended?.legs) {
    route.recommended.legs.forEach((leg) => {
      if (leg.destination?.geometry?.coordinates && leg.station?.station_id) {
        const stationKey = `${leg.destination.geometry.coordinates[0]}-${leg.destination.geometry.coordinates[1]}`;

        if (!chargingStations.has(stationKey)) {
          chargingStations.add(stationKey);

          const chargingDuration = leg.durations?.charging;
          const durationText = chargingDuration
            ? ` (${Math.round(chargingDuration / 60)} min)`
            : '';

          markers.push({
            coordinates: [
              leg.destination.geometry.coordinates[0],
              leg.destination.geometry.coordinates[1],
            ],
            color: '#eab308',
            label: `${leg.destination.properties?.name || `Estação ${leg.station.station_id}`}${durationText}`,
            type: 'charging_station',
            chargingDuration: chargingDuration,
            stationId: leg.station.station_id,
          });
        }
      }

      if (leg.origin?.geometry?.coordinates && leg.origin.properties?.station_id) {
        const stationKey = `${leg.origin.geometry.coordinates[0]}-${leg.origin.geometry.coordinates[1]}`;

        if (!chargingStations.has(stationKey)) {
          chargingStations.add(stationKey);

          const chargingDuration = leg.durations?.charging;
          const durationText = chargingDuration
            ? ` (${Math.round(chargingDuration / 60)} min)`
            : '';

          markers.push({
            coordinates: [
              leg.origin.geometry.coordinates[0],
              leg.origin.geometry.coordinates[1],
            ],
            color: '#eab308',
            label: `${leg.origin.properties?.name || `Estação ${leg.origin.properties.station_id}`}${durationText}`,
            type: 'charging_station',
            chargingDuration: chargingDuration,
            stationId: leg.origin.properties.station_id,
          });
        }
      }
    });
  }

  return markers;
}

export function createRouteGeoJSON(polyline: string) {
  const coordinates = decodePolyline(polyline);
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates,
    },
  };
}

export function calculateBounds(coordinates: [number, number][]): maplibregl.LngLatBounds | null {
  if (coordinates.length === 0) return null;

  return coordinates.reduce(
    (bounds, coord) => bounds.extend(coord),
    new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
  );
}
