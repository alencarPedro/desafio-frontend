import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { RouteDetails } from '../types/route';
import {
  createMarker,
  extractMarkersFromRoute,
  createRouteGeoJSON,
  calculateBounds,
} from '../utils/mapHelpers';
import { decodePolyline } from '../utils/polyline';

interface UseMapOptions {
  route?: RouteDetails | null;
  origin?: { coordinates: [number, number]; name?: string } | null;
  destination?: { coordinates: [number, number]; name?: string } | null;
}

interface UserLocation {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

export function useMap({ route, origin, destination }: UseMapOptions) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const layersRef = useRef<string[]>([]);
  const sourcesRef = useRef<string[]>([]);
  const mapLoadedRef = useRef(false);
  const userLocationFetchedRef = useRef(false);

  // Declarar funções de limpeza primeiro
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  const clearLayersAndSources = useCallback(() => {
    if (!mapRef.current) return;
    layersRef.current.forEach(layerId => {
      if (mapRef.current?.getLayer(layerId)) {
        mapRef.current.removeLayer(layerId);
      }
    });
    layersRef.current = [];
    sourcesRef.current.forEach(sourceId => {
      if (mapRef.current?.getSource(sourceId)) {
        mapRef.current.removeSource(sourceId);
      }
    });
    sourcesRef.current = [];
  }, []);

  // Função para desenhar marcadores e linha direta (antes de calcular rota)
  const drawDirectLine = useCallback(() => {
    if (!mapRef.current || !mapLoadedRef.current) return;
    if (route?.recommended) return; // Não desenhar linha direta se já tem rota calculada

    const map = mapRef.current;
    clearMarkers();
    clearLayersAndSources();

    // Adicionar marcadores de origem e destino
    if (origin?.coordinates) {
      const marker = createMarker(map, origin.coordinates, '#10b981', origin.name || 'Origem', 'origin');
      markersRef.current.push(marker);
    }

    if (destination?.coordinates) {
      const marker = createMarker(map, destination.coordinates, '#ef4444', destination.name || 'Destino', 'destination');
      markersRef.current.push(marker);
    }

    // Desenhar linha tracejada reta entre origem e destino
    if (origin?.coordinates && destination?.coordinates) {
      const directLineGeoJSON = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: [origin.coordinates, destination.coordinates],
        },
      };

      map.addSource('direct-line', { type: 'geojson', data: directLineGeoJSON });
      sourcesRef.current.push('direct-line');

      map.addLayer({
        id: 'direct-line-layer',
        type: 'line',
        source: 'direct-line',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2],
        },
      });
      layersRef.current.push('direct-line-layer');

      // Ajustar zoom para mostrar ambos os pontos
      const bounds = new maplibregl.LngLatBounds(origin.coordinates, destination.coordinates);
      map.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        duration: 500,
      });
    }
  }, [origin, destination, route, clearMarkers, clearLayersAndSources]);

  // Função para desenhar a rota
  const drawRoute = useCallback(() => {
    if (!mapRef.current || !mapLoadedRef.current || !route?.recommended) return;

    const map = mapRef.current;
    clearMarkers();
    clearLayersAndSources();

    // Desenhar rota principal
    const mainPolyline = route.recommended.polyline;
    if (mainPolyline) {
      try {
        const routeGeoJSON = createRouteGeoJSON(mainPolyline);
        map.addSource('route', { type: 'geojson', data: routeGeoJSON });
        sourcesRef.current.push('route');

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8,
          },
        });
        layersRef.current.push('route-line');

        const coordinates = decodePolyline(mainPolyline);
        const bounds = calculateBounds(coordinates);
        if (bounds) {
          map.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: 100, right: 100 },
            duration: 1000,
          });
        }
      } catch (error) {
        console.error('Erro ao desenhar rota:', error);
      }
    }

    // Adicionar marcadores com popups
    const markers = extractMarkersFromRoute(route, origin, destination);
    markers.forEach((markerData) => {
      const { coordinates, color, label, type, chargingDuration, stationId } = markerData;

      const marker = createMarker(map, coordinates, color, label, type);

      // Adicionar popup para estações de recarga
      if (type === 'charging_station') {
        const popupContent = document.createElement('div');
        popupContent.className = 'p-2';
        popupContent.innerHTML = `
          <div class="font-semibold text-sm mb-1">⚡ ${label.split(' (')[0]}</div>
          ${chargingDuration ? `<div class="text-xs text-gray-600">Tempo de recarga: ${Math.round(chargingDuration / 60)} minutos</div>` : ''}
          ${stationId ? `<div class="text-xs text-gray-500 mt-1">ID: ${stationId}</div>` : ''}
        `;

        const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
          .setDOMContent(popupContent);

        marker.getElement().addEventListener('click', () => {
          popup.setLngLat(coordinates).addTo(map);
        });
      }

      markersRef.current.push(marker);
    });

    // Desenhar legs individuais
    if (route.recommended.legs) {
      route.recommended.legs.forEach((leg, index) => {
        if (leg.polyline) {
          try {
            const legGeoJSON = createRouteGeoJSON(leg.polyline);
            const sourceId = `leg-${index}`;
            const layerId = `leg-line-${index}`;

            if (!map.getSource(sourceId)) {
              map.addSource(sourceId, { type: 'geojson', data: legGeoJSON });
              sourcesRef.current.push(sourceId);

              map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                  'line-color': '#60a5fa',
                  'line-width': 3,
                  'line-opacity': 0.6,
                },
              });
              layersRef.current.push(layerId);
            }
          } catch (error) {
            console.error(`Erro ao desenhar leg ${index}:`, error);
          }
        }
      });
    }
  }, [route, origin, destination, clearMarkers, clearLayersAndSources]);

  // Buscar localização do usuário via IP
  const fetchUserLocation = useCallback(async (): Promise<UserLocation | null> => {
    try {
      const response = await fetch('http://ip-api.com/json/');
      if (!response.ok) {
        throw new Error('Erro ao buscar localização');
      }
      const data = await response.json();
      if (data.status === 'success') {
        return {
          lat: data.lat,
          lon: data.lon,
          city: data.city,
          country: data.country,
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar localização do usuário:', error);
      return null;
    }
  }, []);

  // Inicializar mapa - seguindo o padrão do repositório openfreemap-examples
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicialização simples conforme o exemplo do repositório
    // Começar com coordenadas padrão, depois atualizar com a localização do usuário
    mapRef.current = new maplibregl.Map({
      style: '/styles/dark.json',
      container: mapContainerRef.current,
      center: [0, 0],
      zoom: 2,
    });

    // Adicionar controles
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Aguardar o mapa carregar
    mapRef.current.on('load', async () => {
      mapLoadedRef.current = true;

      // Se não há origem definida, buscar localização do usuário e animar até lá
      if (!origin && !userLocationFetchedRef.current) {
        userLocationFetchedRef.current = true;
        const userLocation = await fetchUserLocation();

        if (userLocation && mapRef.current) {
          // Usar flyTo para animar até a localização do usuário
          mapRef.current.flyTo({
            center: [userLocation.lon, userLocation.lat],
            zoom: 10,
            duration: 2000,
          });
        }
      }

      // Desenhar rota se existir
      if (route?.recommended) {
        drawRoute();
      }
    });

    return () => {
      clearMarkers();
      clearLayersAndSources();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      mapLoadedRef.current = false;
      userLocationFetchedRef.current = false;
    };
  }, []);

  // Atualizar marcadores e linha direta quando origem/destino mudarem (sem rota calculada)
  useEffect(() => {
    if (mapLoadedRef.current && !route?.recommended) {
      drawDirectLine();
    }
  }, [origin, destination, route, drawDirectLine]);

  // Atualizar rota quando mudar
  useEffect(() => {
    if (mapLoadedRef.current && route?.recommended) {
      drawRoute();
    }
  }, [route, origin, destination, drawRoute]);

  return { mapContainerRef };
}
