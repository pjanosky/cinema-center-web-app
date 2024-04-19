import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import usersClient from "../API/Users/client";
import { useDispatch, useSelector } from "react-redux";
import store, { CCState } from "../Store/Store";
import {
  UserState,
  setIsFetching,
  setIsPending,
  setUser,
} from "../Store/UserReducer";
import { User } from "../API/Users/types";

export function useUserState(): UserState {
  return useSelector((state: CCState) => state.userReducer);
}

export function useCurrentUser(): User | undefined {
  const { currentUser, isPending } = useSelector(
    (state: CCState) => state.userReducer
  );
  const refetchUser = useRefetchUser();
  useEffect(() => {
    if (isPending) {
      refetchUser();
    }
  }, [isPending, refetchUser]);
  return currentUser;
}

export function useRefetchUser() {
  const dispatch = useDispatch();
  const fetchUser = useCallback(async () => {
    // need to get isFetching synchronously
    const { isFetching } = store.getState().userReducer;
    if (isFetching) return;
    dispatch(setIsFetching(true));
    try {
      const user = await usersClient.getCurrentUser();
      dispatch(setUser(user));
    } catch (error) {
      dispatch(setUser(undefined));
    } finally {
      dispatch(setIsPending(false));
      dispatch(setIsFetching(false));
    }
  }, [dispatch]);
  return fetchUser;
}

export function useAssertCurrentUser() {
  let { isPending, currentUser } = useUserState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isPending && !currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, isPending, navigate]);
  return currentUser;
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
