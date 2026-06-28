import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await axiosInstance.get('/roles');
      return res.data.roles;
    },
    staleTime: 3 * 60 * 1000,
  });
};

export default useGetRoles;
