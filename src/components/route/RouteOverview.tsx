import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { RouteBreakdown } from './RouteBreakdown';
import { formatTime, formatDistance, formatConsumption, calculateArrivalTime } from '../../utils/routeHelpers';
import type { RouteDetails } from '../../types/route';
import type { BreakdownItem } from '../../hooks/useRouteBreakdown';

interface RouteOverviewProps {
  route: RouteDetails;
  origin: { name: string; coordinates: [number, number] } | null;
  destination: { name: string; coordinates: [number, number] } | null;
  originInput: string;
  destinationInput: string;
  vehicleName: string;
  breakdownItems: BreakdownItem[];
  onClose: () => void;
}

export function RouteOverview({
  route,
  origin,
  destination,
  originInput,
  destinationInput,
  vehicleName,
  breakdownItems,
  onClose,
}: RouteOverviewProps) {
  const summary = route.summary;
  const charges = route.recommended?.charges ?? (route.recommended?.legs?.filter(leg => leg.station).length || 0);
  const durations = route.recommended?.durations;
  const arrivalTime = durations?.total ? calculateArrivalTime(durations.total) : null;

  return (
    <div className="fixed top-4 left-4 z-50 bg-gray-900/95 rounded-xl shadow-2xl w-full max-w-sm border border-gray-800 backdrop-blur-sm max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1 line-clamp-2">
              {origin?.name || originInput} para {destination?.name || destinationInput}
            </h2>
            <p className="text-gray-400 text-sm">
              Dirigindo o <span className="text-sky-400">{vehicleName}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Route Summary */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-3xl font-bold text-white">
            {durations?.total ? formatTime(durations.total) : 'N/A'}
          </div>
          <div className="text-sky-400 text-sm font-medium">
            Chegada às {arrivalTime || 'N/A'}
          </div>
        </div>
        <div className="text-gray-400 text-sm">
          {summary?.distance ? formatDistance(summary.distance) : 'N/A'} · {charges} {charges === 1 ? 'parada' : 'paradas'}
        </div>
      </div>

      {/* Route Details */}
      <div className="p-6 border-b border-gray-800 space-y-3">
        {durations?.charging !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Duração de recarga</span>
            <span className="text-white text-sm font-medium">
              {formatTime(durations.charging)}
            </span>
          </div>
        )}
        {summary?.consumption && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Consumo estimado</span>
            <span className="text-white text-sm font-medium">{formatConsumption(summary.consumption)}</span>
          </div>
        )}
        {route.recommended?.range_at_origin && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Alcance na origem</span>
            <span className="text-white text-sm font-medium">{route.recommended.range_at_origin.toFixed(0)} km</span>
          </div>
        )}
        {route.recommended?.range_at_destination && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Alcance no destino</span>
            <span className="text-white text-sm font-medium">{route.recommended.range_at_destination.toFixed(0)} km</span>
          </div>
        )}
      </div>

      {/* Route Breakdown */}
      <RouteBreakdown items={breakdownItems} />
    </div>
  );
}
