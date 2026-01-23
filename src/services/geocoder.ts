export interface PhotonFeature {
    properties: {
      name: string;
      country?: string;
      state?: string;
      city?: string;
      street?: string;
      housenumber?: string;
      postcode?: string;
    };
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
    };
  }

export  interface PhotonResponse {
    features: PhotonFeature[];
  }


  export async function searchPlaces(query: string): Promise<PhotonFeature[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=5`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar lugares');
      }

      const data: PhotonResponse = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Erro no geocoder:', error);
      return [];
    }
  }

  /**
   * Formata um lugar do Photon para exibição
   */
  export function formatPlaceName(feature: PhotonFeature): string {
    const { name, city, state, country } = feature.properties;
    const parts = [name];

    if (city && city !== name) parts.push(city);
    if (state) parts.push(state);
    if (country) parts.push(country);

    return parts.join(', ');
  }
