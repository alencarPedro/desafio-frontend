import { useMemo } from 'react';
import type { RouteDetails } from '../types/route';
import { calculateBatteryPercentage } from '../utils/routeHelpers';

export interface BreakdownItem {
  type: 'origin' | 'drive' | 'charge' | 'destination';
  name?: string;
  time?: string;
  battery?: number;
  batteryBefore?: number;
  batteryAfter?: number;
  distance?: number;
  duration?: number;
  payload?: number;
}

interface UseRouteBreakdownParams {
  route: RouteDetails | null;
  origin: { name: string; coordinates: [number, number] } | null;
  destination: { name: string; coordinates: [number, number] } | null;
  originInput: string;
  destinationInput: string;
  stateOfCharge: number;
}

export function useRouteBreakdown({
  route,
  origin,
  destination,
  originInput,
  destinationInput,
  stateOfCharge,
}: UseRouteBreakdownParams): BreakdownItem[] {
  return useMemo(() => {
    if (!route?.recommended) return [];

    const breakdown: BreakdownItem[] = [];
    const legs = route.recommended.legs || [];
    const summary = route.summary;
    const durations = route.recommended.durations;
    const rangeAtOrigin = route.recommended.range_at_origin || 0;

    // Origem
    if (origin?.name || originInput) {
      breakdown.push({
        type: 'origin',
        name: origin?.name || originInput,
        time: '00:00',
        battery: stateOfCharge,
        payload: 0,
      });
    }

    // Rastrear bateria atual durante o percurso
    let currentBattery = stateOfCharge;

    // Legs
    legs.forEach((leg) => {
      if (leg.durations?.driving && leg.distance) {
        const driveKm = (leg.distance / 1000).toFixed(1);

        breakdown.push({
          type: 'drive',
          distance: parseFloat(driveKm),
          duration: leg.durations.driving,
        });

        // Atualizar bateria após dirigir
        if (leg.range_at_destination && rangeAtOrigin > 0) {
          currentBattery = calculateBatteryPercentage(
            leg.range_at_destination,
            rangeAtOrigin,
            stateOfCharge
          );
        }
      }

      if (leg.station && leg.destination) {
        const batteryBefore = currentBattery;

        // Bateria após recarga
        let batteryAfter = batteryBefore;
        if (leg.range_after_charge && rangeAtOrigin > 0) {
          batteryAfter = calculateBatteryPercentage(
            leg.range_after_charge,
            rangeAtOrigin,
            stateOfCharge
          );
        } else if (leg.range_at_destination && rangeAtOrigin > 0) {
          batteryAfter = calculateBatteryPercentage(
            leg.range_at_destination,
            rangeAtOrigin,
            stateOfCharge
          );
        }

        breakdown.push({
          type: 'charge',
          name: leg.destination.properties?.name || `Estação ${leg.station.station_id}`,
          duration: leg.durations?.charging || 0,
          batteryBefore,
          batteryAfter,
        });

        currentBattery = batteryAfter;
      }
    });

    // Destino
    if (destination?.name || destinationInput) {
      const totalSeconds = durations?.total || 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      let destinationBattery = stateOfCharge;
      if (route.recommended.range_at_origin && route.recommended.range_at_destination) {
        destinationBattery = calculateBatteryPercentage(
          route.recommended.range_at_destination,
          route.recommended.range_at_origin,
          stateOfCharge
        );
      } else if (summary?.consumption) {
        destinationBattery = Math.max(0, stateOfCharge - Math.round((summary.consumption / 10)));
      }

      breakdown.push({
        type: 'destination',
        name: destination?.name || destinationInput,
        time: timeStr,
        battery: destinationBattery,
        payload: 0,
      });
    }

    return breakdown;
  }, [route, origin, destination, originInput, destinationInput, stateOfCharge]);
}
