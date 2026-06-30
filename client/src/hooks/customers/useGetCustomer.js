import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetCustomer = (id) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/customers/${id}`);
      return res.data.customer;
    },
    enabled: !!id,
  });
};

export default useGetCustomer;
