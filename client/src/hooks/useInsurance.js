import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export default function useInsurance() {
  const query = useQuery({
    queryKey: ["insurance"],
    queryFn: () => api.get("/insurance").then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
