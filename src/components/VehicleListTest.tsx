import { useState } from 'react';
import { chargetripQuery } from '../lib/chargetrip-client';

const VEHICLE_LIST_QUERY = `
 query VehicleList {
    vehicleList {
        id
        naming {
            make
            model
        }
        type
    }
 }
`;

interface Vehicle {
    id: string;
    naming: {
        make: string;
        model: string;
    };
    type: string;
}

export function VehicleListTest() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchVehicles = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await chargetripQuery(VEHICLE_LIST_QUERY);
            setVehicles(data.vehicleList || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            console.error('Erro ao buscar veículos:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Teste Chargetrip API</h2>

          <button
            onClick={handleFetchVehicles}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Carregando...' : 'Buscar Veículos'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Erro:</strong> {error}
            </div>
          )}

          {vehicles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Veículos encontrados:</h3>
              <ul className="list-disc list-inside">
                {vehicles.map((vehicle) => (
                  <li key={vehicle.id}>
                    {vehicle.naming.make} - {vehicle.naming.model} - {vehicle.type}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
}
