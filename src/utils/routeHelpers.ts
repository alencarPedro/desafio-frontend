
/**
 * Formata segundos em formato HH:MM
 */
export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  /**
   * Calcula a hora de chegada baseada na duração total
   */
  export function calculateArrivalTime(totalSeconds: number): string {
    const now = new Date();
    const arrival = new Date(now.getTime() + totalSeconds * 1000);
    return arrival.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Calcula a porcentagem da bateria baseada no alcance
   */
  export function calculateBatteryPercentage(
    range: number,
    rangeAtOrigin: number,
    stateOfCharge: number
  ): number {
    if (!rangeAtOrigin || rangeAtOrigin <= 0) return stateOfCharge;
    const percentage = Math.round((range / rangeAtOrigin) * stateOfCharge);
    return Math.max(0, Math.min(100, percentage));
  }

  /**
   * Formata distância em km com vírgula como separador decimal
   */
  export function formatDistance(meters: number): string {
    return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
  }

  /**
   * Formata consumo em kWh com vírgula como separador decimal
   */
  export function formatConsumption(kwh: number): string {
    return `${kwh.toFixed(1).replace('.', ',')} kWh`;
  }
