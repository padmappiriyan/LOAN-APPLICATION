import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const useUpdateRoleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await axiosInstance.put(`/roles/${id}`, { isActive });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(`Role ${variables.isActive ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role status.');
    },
  });
};

export default useUpdateRoleStatus;
