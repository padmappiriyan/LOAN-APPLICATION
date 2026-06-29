import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleData) => {
      const res = await axiosInstance.post('/roles', roleData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create role.');
    },
  });
};

export default useCreateRole;
