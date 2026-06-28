import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      return res.data;
    },
  });
};

export default useForgotPassword;
