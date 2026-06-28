import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../useAuth';
import { getDashboardRouteForUser } from '../../utils/routeUtils';

const useLogin = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuth();

  return useMutation({
    mutationFn: async (credentials) => {
      const res = await axiosInstance.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      setUserData(data.user);
      if (data.user.mustChangePassword) {
        navigate('/change-password', { replace: true });
      } else {
        const dest = getDashboardRouteForUser(data.user);
        navigate(dest, { replace: true });
      }
    },
  });
};

export default useLogin;
