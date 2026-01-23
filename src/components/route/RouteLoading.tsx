import { Loader2 } from 'lucide-react';

export function RouteLoading() {
  return (
    <div className="fixed top-4 left-4 z-50 bg-gray-900/95 rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-800 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-sky-400 mb-4" />
        <p className="text-white text-lg font-medium">Estamos calculando a sua rota</p>
      </div>
    </div>
  );
}
