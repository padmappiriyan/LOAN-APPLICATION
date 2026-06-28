import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../useAuth';

/**
 * Runs on app startup to restore session from HTTP-only cookie.
 * Populates AuthContext with user data if cookie is valid.
 */
const useGetMe = () => {
  const { setUserData, setIsLoading } = useAuth();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUserData(query.data);
    } else if (query.isError) {
      setIsLoading(false);
    }
  }, [query.isSuccess, query.isError, query.data, setUserData, setIsLoading]);

  return query;
};

export default useGetMe;
