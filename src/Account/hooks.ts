import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import usersClient from "../API/Users/client";

export function useQueryCurrentUser() {
  const queryResult = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await usersClient.getCurrentUser();
      return user;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
  });
  return queryResult;
}

export function useCurrentUser() {
  let { error, isPending, data } = useQueryCurrentUser();
  return isPending || error ? undefined : data;
}

export function useRefetchUser() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    await queryClient.refetchQueries();
  }, [queryClient]);
}

export function useAssertCurrentUser() {
  let { isPending, data } = useQueryCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isPending && !data) {
      navigate("/login", { replace: true });
    }
  }, [data, isPending, navigate]);
  return data;
}

export function useRefetchOnUnauthorized() {
  const refetchUser = useRefetchUser();
  return useCallback(
    async (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        await refetchUser();
      }
    },
    [refetchUser]
  );
}
