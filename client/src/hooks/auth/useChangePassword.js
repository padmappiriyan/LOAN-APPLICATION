import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../useAuth';



const useChangePassword = () => {
  const navigate = useNavigate();
  const { user, setUserData } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/auth/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      if (user) {
        setUserData({ ...user, mustChangePassword: false });
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    },
  });
};

export default useChangePassword;
