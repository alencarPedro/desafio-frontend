import { LocationInput } from '../LocationInput';
import { VehicleSelect } from '../VehicleSelect';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

interface RoutePlannerFormProps {
  origin: { name: string; coordinates: [number, number] } | null;
  destination: { name: string; coordinates: [number, number] } | null;
  originInput: string;
  destinationInput: string;
  vehicleId: string;
  stateOfCharge: number;
  error: string | null;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginSelect: (location: { name: string; coordinates: [number, number] } | null) => void;
  onDestinationSelect: (location: { name: string; coordinates: [number, number] } | null) => void;
  onVehicleChange: (id: string) => void;
  onStateOfChargeChange: (value: number) => void;
  onSwapOriginDestination: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function RoutePlannerForm({
  origin,
  destination,
  originInput,
  destinationInput,
  vehicleId,
  stateOfCharge,
  error,
  onOriginChange,
  onDestinationChange,
  onOriginSelect,
  onDestinationSelect,
  onVehicleChange,
  onStateOfChargeChange,
  onSwapOriginDestination,
  onSubmit,
}: RoutePlannerFormProps) {
  return (
    <div className="fixed top-4 left-4 z-50 bg-gray-900/95 rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-800 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-white">Planejar Rota</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <VehicleSelect value={vehicleId} onChange={onVehicleChange} />

        <div className="space-y-2">
          <Label htmlFor="stateOfCharge" className="text-gray-300">
            Estado de Carga da Bateria: {stateOfCharge}%
          </Label>
          <Slider
            id="stateOfCharge"
            min={0}
            max={100}
            step={1}
            value={[stateOfCharge]}
            onValueChange={(values) => onStateOfChargeChange(values[0])}
          />
        </div>

        <div className="relative">
          <LocationInput
            label="Origem"
            value={originInput}
            onChange={onOriginChange}
            onLocationSelect={onOriginSelect}
          />
          {(origin || originInput) && (destination || destinationInput) && (
            <div className="absolute right-2 top-8">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onSwapOriginDestination}
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8"
                title="Inverter origem e destino"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <LocationInput
          label="Destino"
          value={destinationInput}
          onChange={onDestinationChange}
          onLocationSelect={onDestinationSelect}
        />

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-md text-sm">
            <strong>Erro:</strong> {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={(!origin && !originInput.trim()) || (!destination && !destinationInput.trim()) || !vehicleId}
          className="w-full bg-sky-400 hover:bg-sky-500 text-white font-medium"
        >
          Calcular Rota
        </Button>
      </form>
    </div>
  );
}
