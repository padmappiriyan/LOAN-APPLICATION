import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../useAuth';

const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout');
    },
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
    onError: () => {
      // Even on error, clear local state
      clearUser();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
};

export default useLogout;
