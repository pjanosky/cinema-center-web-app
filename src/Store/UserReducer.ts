import { createSlice } from "@reduxjs/toolkit";
import { User } from "../API/Users/types";

export type UserState = {
  currentUser: User | undefined;
  isFetching: boolean;
  isPending: boolean;
};

const initialState: UserState = {
  currentUser: undefined,
  isFetching: false,
  isPending: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.currentUser = payload;
    },
    setIsFetching: (state, { payload }) => {
      state.isFetching = payload;
    },
    setIsPending: (state, { payload }) => {
      state.isPending = payload;
    },
  },
});

export const { setUser, setIsFetching, setIsPending } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
