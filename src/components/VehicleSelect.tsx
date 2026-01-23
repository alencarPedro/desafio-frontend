import { useVehicles } from '../hooks/useVehicles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface VehicleSelectProps {
  value: string;
  onChange: (vehicleId: string) => void;
}

export function VehicleSelect({ value, onChange }: VehicleSelectProps) {
  const { vehicles, loading, error } = useVehicles();

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Veículo
        </label>
        <div className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-400">
          Carregando veículos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Veículo
        </label>
        <div className="w-full px-4 py-2 border border-red-800 rounded-md bg-red-900/20 text-red-400">
          Erro ao carregar veículos: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="vehicle" className="block text-sm font-medium text-gray-300 mb-1">
        Veículo
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="vehicle" className="w-full bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Selecione um veículo" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {vehicles.map((vehicle) => (
            <SelectItem
              key={vehicle.id}
              value={vehicle.id}
              className="text-white hover:bg-gray-700 focus:bg-gray-700"
            >
              {vehicle.naming.make} {vehicle.naming.model} ({vehicle.type})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
