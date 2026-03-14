import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export default function useListing(slug) {
  const query = useQuery({
    queryKey: ["listing", slug],
    queryFn: () => api.get(`/listings/${slug}`).then((res) => res.data.data),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
