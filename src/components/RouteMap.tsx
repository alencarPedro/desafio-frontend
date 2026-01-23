import { useMap } from '../hooks/useMap';
import { useRouteStore } from '../stores/routeStore';

export function RouteMap() {
  const route = useRouteStore((state) => state.route);
  const origin = useRouteStore((state) => state.origin);
  const destination = useRouteStore((state) => state.destination);
  const { mapContainerRef } = useMap({ route, origin, destination });

  return (
    <div className="absolute inset-0 w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legenda de marcadores */}
      {route && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-10">
          <div className="text-xs font-semibold text-gray-700 mb-2">Legenda</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-600">Origem</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-600">Destino</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">⚡</div>
              <span className="text-xs text-gray-600">Estação de Recarga</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
