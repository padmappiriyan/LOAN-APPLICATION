import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users');
      return res.data.users;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export default useGetUsers;
