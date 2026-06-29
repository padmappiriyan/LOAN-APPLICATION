import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosInstance.put(`/roles/${id}`, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
      toast.success('Role updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role.');
    },
  });
};

export default useUpdateRole;
