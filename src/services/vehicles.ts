import { chargetripQuery } from '../lib/chargetrip-client';

const VEHICLE_LIST_QUERY = `
  query VehicleList {
    vehicleList {
      id
      naming {
        make
        model
      }
      type
    }
  }
`;

export interface Vehicle {
  id: string;
  naming: {
    make: string;
    model: string;
  };
  type: string;
}

export async function getVehicleList(): Promise<Vehicle[]> {
  const data = await chargetripQuery(VEHICLE_LIST_QUERY) as {
    vehicleList: Vehicle[];
  };
  return data.vehicleList || [];
}
