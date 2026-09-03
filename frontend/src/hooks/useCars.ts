import { useQuery } from '@tanstack/react-query';
import { getCarsMock } from '@/services/carService';
import type { CarFilterParams } from '@/types/Car';

export function useCars(filter: CarFilterParams) {
  return useQuery({
    queryKey: ['cars', filter],
    queryFn: () => getCarsMock(filter),
  });
}
