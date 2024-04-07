import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as client from "./client";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";

export function useQueryUser() {
  const queryResult = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await client.getProfile();
      return user;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
  });
  return queryResult;
}

export function useUser() {
  let { error, data } = useQueryUser();
  return error ? undefined : data;
}

export function useRefreshUser() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    await queryClient.refetchQueries();
  }, [queryClient]);
}

export function useAssertUser() {
  let { isPending, data } = useQueryUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isPending && !data) {
      navigate("/login", { replace: true });
    }
  }, [data, isPending, navigate]);
  return data;
}

export function useRefreshOnUnauthorized() {
  const refreshUser = useRefreshUser();
  const refreshOnUnauthenticated = useCallback(
    async (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        await refreshUser();
      }
    },
    [refreshUser]
  );
  return refreshOnUnauthenticated;
}
