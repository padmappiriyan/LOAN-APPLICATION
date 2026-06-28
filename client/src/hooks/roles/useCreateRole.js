import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
      navigate('/admin/roles');
    },
  });
};

export default useCreateRole;
