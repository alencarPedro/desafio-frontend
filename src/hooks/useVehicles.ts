import { useState, useEffect } from 'react';
import { getVehicleList, type Vehicle } from '../services/vehicles';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVehicleList();
        setVehicles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar veículos');
        console.error('Erro ao buscar veículos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}
