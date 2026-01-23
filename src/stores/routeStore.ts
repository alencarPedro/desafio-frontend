import { create } from 'zustand';
import type { RouteDetails, RouteInput } from '../types/route';
import { createRoute, getRouteDetails } from '../services/routes';
import { searchPlaces } from '../services/geocoder';

interface Location {
  name: string;
  coordinates: [number, number];
}

interface RouteState {
  route: RouteDetails | null;
  loading: boolean;
  error: string | null;
  origin: Location | null;
  destination: Location | null;
  originInput: string;
  destinationInput: string;
  vehicleId: string;
  stateOfCharge: number;

  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  setOriginInput: (value: string) => void;
  setDestinationInput: (value: string) => void;
  setVehicleId: (id: string) => void;
  setStateOfCharge: (value: number) => void;
  swapOriginDestination: () => void;
  clearRoute: () => void;
  calculateRoute: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  route: null,
  loading: false,
  error: null,
  origin: null,
  destination: null,
  originInput: '',
  destinationInput: '',
  vehicleId: '',
  stateOfCharge: 80,
};

export const useRouteStore = create<RouteState>((set, get) => ({
  ...initialState,

  setOrigin: (location) => set({ origin: location }),
  setDestination: (location) => set({ destination: location }),
  setOriginInput: (value) => {
    set({ originInput: value });
    if (!value.trim()) {
      set({ origin: null });
    }
  },
  setDestinationInput: (value) => {
    set({ destinationInput: value });
    if (!value.trim()) {
      set({ destination: null });
    }
  },
  setVehicleId: (id) => set({ vehicleId: id }),
  setStateOfCharge: (value) => set({ stateOfCharge: value }),

  swapOriginDestination: () => {
    const { origin, destination, originInput, destinationInput } = get();
    set({
      origin: destination,
      destination: origin,
      originInput: destinationInput,
      destinationInput: originInput,
    });
  },

  clearRoute: () => {
    set({ route: null, error: null });
  },

  calculateRoute: async () => {
    const { origin, destination, originInput, destinationInput, vehicleId, stateOfCharge } = get();

    if (!vehicleId) {
      set({ error: 'Por favor, selecione um veículo' });
      return;
    }

    set({ loading: true, error: null, route: null });

    try {
      let finalOrigin = origin;
      let finalDestination = destination;

      if (!finalOrigin && originInput.trim()) {
        const originResults = await searchPlaces(originInput);
        if (originResults.length > 0) {
          finalOrigin = {
            name: originInput,
            coordinates: originResults[0].geometry.coordinates,
          };
        } else {
          throw new Error('Não foi possível encontrar a origem. Por favor, selecione uma opção da lista.');
        }
      }

      if (!finalDestination && destinationInput.trim()) {
        const destinationResults = await searchPlaces(destinationInput);
        if (destinationResults.length > 0) {
          finalDestination = {
            name: destinationInput,
            coordinates: destinationResults[0].geometry.coordinates,
          };
        } else {
          throw new Error('Não foi possível encontrar o destino. Por favor, selecione uma opção da lista.');
        }
      }

      if (!finalOrigin || !finalDestination) {
        set({ error: 'Por favor, preencha origem e destino' });
        return;
      }

      const routeInput: RouteInput = {
        vehicle: {
          id: vehicleId,
          battery: {
            state_of_charge: {
              value: stateOfCharge,
              type: 'percentage',
            },
          },
          climate: true,
        },
        origin: {
          type: 'Feature',
          properties: {
            location: { name: finalOrigin.name },
            vehicle: { occupants: 1 },
          },
          geometry: {
            type: 'Point',
            coordinates: finalOrigin.coordinates,
          },
        },
        destination: {
          type: 'Feature',
          properties: {
            location: { name: finalDestination.name },
          },
          geometry: {
            type: 'Point',
            coordinates: finalDestination.coordinates,
          },
        },
      };

      const routeId = await createRoute(routeInput);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const routeDetails = await getRouteDetails(routeId);

      if (routeDetails) {
        set({ route: routeDetails, loading: false });
      } else {
        throw new Error('Não foi possível obter os detalhes da rota');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular rota';
      set({ error: errorMessage, loading: false });
      console.error('Erro ao calcular rota:', err);
    }
  },

  reset: () => set(initialState),
}));
