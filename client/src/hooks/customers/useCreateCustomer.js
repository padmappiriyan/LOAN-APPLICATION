import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData) => {
      const res = await axiosInstance.post('/customers', customerData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create customer.');
    },
  });
};

export default useCreateCustomer;
