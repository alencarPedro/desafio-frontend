// src/components/RoutePlanner.tsx
import { useState } from 'react';
import { LocationInput } from './LocationInput';
import { VehicleSelect } from './VehicleSelect';
import { useRoute } from '../hooks/useRoute';
import type { RouteInput } from '../types/route';

interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export function RoutePlanner() {
  const [origin, setOrigin] = useState<string>('');
  const [originLocation, setOriginLocation] = useState<Location | null>(null);

  const [destination, setDestination] = useState<string>('');
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);

  const [vehicleId, setVehicleId] = useState<string>('');
  const [stateOfCharge, setStateOfCharge] = useState<number>(80);

  const { route, loading, error, calculateRoute } = useRoute();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originLocation || !destinationLocation) {
      alert('Por favor, selecione origem e destino da lista de sugestões');
      return;
    }

    if (!vehicleId) {
      alert('Por favor, selecione um veículo');
      return;
    }

    // Montar o input no formato correto da API
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
          location: {
            name: originLocation.name,
          },
          vehicle: {
            occupants: 1,
          },
        },
        geometry: {
          type: 'Point',
          coordinates: originLocation.coordinates,
        },
      },
      destination: {
        type: 'Feature',
        properties: {
          location: {
            name: destinationLocation.name,
          },
        },
        geometry: {
          type: 'Point',
          coordinates: destinationLocation.coordinates,
        },
      },
    };

    await calculateRoute(routeInput);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Planejar Rota</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LocationInput
          label="Origem"
          value={origin}
          onChange={setOrigin}
          onLocationSelect={(location) => setOriginLocation(location)}
        />

        <LocationInput
          label="Destino"
          value={destination}
          onChange={setDestination}
          onLocationSelect={(location) => setDestinationLocation(location)}
        />

        <VehicleSelect value={vehicleId} onChange={setVehicleId} />

        <div>
          <label htmlFor="stateOfCharge" className="block text-sm font-medium text-gray-700 mb-1">
            Estado de Carga da Bateria (%)
          </label>
          <input
            id="stateOfCharge"
            type="number"
            min="0"
            max="100"
            value={stateOfCharge}
            onChange={(e) => setStateOfCharge(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={!originLocation || !destinationLocation || !vehicleId || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculando rota...' : 'Planejar Rota'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {route && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-lg mb-2">Rota Calculada!</h3>
          {route.summary && (
            <div className="space-y-1">
              {route.summary.distance && (
                <p>Distância: {(route.summary.distance / 1000).toFixed(2)} km</p>
              )}
              {route.summary.duration && (
                <p>Duração: {Math.round(route.summary.duration / 60)} minutos</p>
              )}
              {route.summary.consumption && (
                <p>Consumo: {route.summary.consumption.toFixed(2)} kWh</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
