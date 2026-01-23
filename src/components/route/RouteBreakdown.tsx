import { Play, MapPin } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { formatTime } from '../../utils/routeHelpers';
import type { BreakdownItem } from '../../hooks/useRouteBreakdown';

interface RouteBreakdownProps {
  items: BreakdownItem[];
}

function BreakdownItemComponent({ item }: { item: BreakdownItem }) {
  if (item.type === 'origin' || item.type === 'destination') {
    return (
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${item.type === 'origin' ? 'text-green-500' : 'text-red-500'}`}>
          {item.type === 'origin' ? (
            <Play className="h-5 w-5 fill-current" />
          ) : (
            <MapPin className="h-5 w-5 fill-current" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-sm font-medium truncate">{item.name}</span>
            <span className="text-gray-400 text-xs ml-2">{item.time}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="text-green-500">●</span>
              <span>{item.battery}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span>22°C</span>
            </div>
            <div>
              Carga: {item.payload || 0} kg
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === 'drive') {
    return (
      <div className="flex items-center gap-3 ml-7">
        <div className="w-px h-8 bg-gray-700"></div>
        <div className="flex-1">
          <div className="text-gray-400 text-xs">
            Dirigir {item.duration ? formatTime(item.duration) : '00:00'} · {item.distance?.toFixed(1).replace('.', ',')} km
          </div>
        </div>
      </div>
    );
  }

  if (item.type === 'charge') {
    return (
      <div className="flex items-center gap-3 ml-7">
        <div className="w-px h-8 bg-gray-700"></div>
        <div className="flex-1">
          <div className="text-gray-400 text-xs mb-1">
            Recarregar {item.duration ? formatTime(item.duration) : '00:00'} · {item.name}
          </div>
          {item.batteryBefore !== undefined && item.batteryAfter !== undefined && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Bateria:</span>
                <span className="text-red-400">{item.batteryBefore}%</span>
                <span className="text-gray-500">→</span>
                <span className="text-green-400">{item.batteryAfter}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function RouteBreakdown({ items }: RouteBreakdownProps) {
  return (
    <div className="p-6">
      <Accordion type="single" collapsible defaultValue="route-breakdown" className="w-full">
        <AccordionItem value="route-breakdown" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline py-4">
            Detalhamento da rota
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {items.map((item, index) => (
                <BreakdownItemComponent key={index} item={item} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
