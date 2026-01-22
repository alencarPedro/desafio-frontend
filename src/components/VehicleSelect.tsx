// src/components/VehicleSelect.tsx
import { useVehicles } from '../hooks/useVehicles';

interface VehicleSelectProps {
  value: string;
  onChange: (vehicleId: string) => void;
}

export function VehicleSelect({ value, onChange }: VehicleSelectProps) {
  const { vehicles, loading, error } = useVehicles();

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Veículo
        </label>
        <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
          Carregando veículos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Veículo
        </label>
        <div className="w-full px-4 py-2 border border-red-300 rounded-md bg-red-50 text-red-700">
          Erro ao carregar veículos: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
        Veículo
      </label>
      <select
        id="vehicle"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione um veículo</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.naming.make} {vehicle.naming.model} ({vehicle.type})
          </option>
        ))}
      </select>
    </div>
  );
}
