import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/auth/reset-password', data);
      return res.data;
    },
    onSuccess: () => {
      navigate('/login?reset=success', { replace: true });
    },
  });
};

export default useResetPassword;
