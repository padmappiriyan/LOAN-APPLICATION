import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetRole = (id) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/roles/${id}`);
      return res.data.role;
    },
    enabled: !!id,
  });
};

export default useGetRole;
