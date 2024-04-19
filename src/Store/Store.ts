import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./UserReducer";

export interface CCState {
  userReducer: UserState;
}

const store = configureStore({
  reducer: { userReducer },
});
export default store;
