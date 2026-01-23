import { useRouteStore } from '../../stores/routeStore';
import { useVehicles } from '../../hooks/useVehicles';
import { useRouteBreakdown } from '../../hooks/useRouteBreakdown';
import { RoutePlannerForm } from './RoutePlannerForm';
import { RouteOverview } from './RouteOverview';
import { RouteLoading } from './RouteLoading';

export function RoutePlanner() {
  const {
    origin,
    destination,
    originInput,
    destinationInput,
    vehicleId,
    stateOfCharge,
    route,
    loading,
    error,
    setOrigin,
    setDestination,
    setOriginInput,
    setDestinationInput,
    setVehicleId,
    setStateOfCharge,
    swapOriginDestination,
    clearRoute,
    calculateRoute,
  } = useRouteStore();

  const { vehicles } = useVehicles();
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const vehicleName = selectedVehicle
    ? `${selectedVehicle.naming.make} ${selectedVehicle.naming.model}`
    : vehicleId;

  const breakdownItems = useRouteBreakdown({
    route,
    origin,
    destination,
    originInput,
    destinationInput,
    stateOfCharge,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await calculateRoute();
  };

  const handleCloseRoute = () => {
    clearRoute();
  };

  if (loading) {
    return <RouteLoading />;
  }

  if (route && route.recommended) {
    return (
      <RouteOverview
        route={route}
        origin={origin}
        destination={destination}
        originInput={originInput}
        destinationInput={destinationInput}
        vehicleName={vehicleName}
        breakdownItems={breakdownItems}
        onClose={handleCloseRoute}
      />
    );
  }

  return (
    <RoutePlannerForm
      origin={origin}
      destination={destination}
      originInput={originInput}
      destinationInput={destinationInput}
      vehicleId={vehicleId}
      stateOfCharge={stateOfCharge}
      error={error}
      onOriginChange={setOriginInput}
      onDestinationChange={setDestinationInput}
      onOriginSelect={setOrigin}
      onDestinationSelect={setDestination}
      onVehicleChange={setVehicleId}
      onStateOfChargeChange={setStateOfCharge}
      onSwapOriginDestination={swapOriginDestination}
      onSubmit={handleSubmit}
    />
  );
}
