import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const { page = 1, limit = 20, search, status } = params;
      
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);

      const res = await axiosInstance.get(`/customers?${queryParams.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useGetCustomers;
