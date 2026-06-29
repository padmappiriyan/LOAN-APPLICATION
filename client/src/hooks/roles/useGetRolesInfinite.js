import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const useGetRolesInfinite = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['roles', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get('/roles', {
        params: {
          page: pageParam,
          limit: 20,
          ...filters,
        },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 3 * 60 * 1000,
  });
};

export default useGetRolesInfinite;
