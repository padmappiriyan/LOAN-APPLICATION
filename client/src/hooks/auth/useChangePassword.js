import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../useAuth';

const ROLE_DASHBOARD_MAP = {
  'Super Admin':   '/dashboard/admin',
  'Manager':       '/dashboard/manager',
  'Field Officer': '/dashboard/officer',
  'Accountant':    '/dashboard/accountant',
};

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
        const dest = ROLE_DASHBOARD_MAP[user.role?.name] || '/dashboard';
        navigate(dest, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    },
  });
};

export default useChangePassword;
