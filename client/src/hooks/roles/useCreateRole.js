import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const useCreateRole = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (roleData) => {
      const res = await axiosInstance.post('/roles', roleData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully!');
      navigate('/roles');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create role.');
    },
  });
};

export default useCreateRole;
