import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../utils/api";

const EMPTY = [];

export default function useListings(params = {}, options = {}) {
  const query = useQuery({
    queryKey: ["listings", params],
    queryFn: () =>
      api.get("/listings", { params }).then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...options,
  });

  const listings = query.data?.listings;
  const total = query.data?.total ?? 0;
  const currentPage = query.data?.page ?? 1;

  return {
    data: listings ?? EMPTY,
    total,
    page: currentPage,
    loading: query.isLoading,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
