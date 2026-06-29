import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetRoles = (params = {}) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: async () => {
      const res = await axiosInstance.get('/roles', { params });
      return res.data.roles;
    },
    staleTime: 3 * 60 * 1000,
  });
};

export default useGetRoles;
