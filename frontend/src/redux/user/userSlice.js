import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isLoading = true;
    },
    signInSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    signInErrorTimeout: (state) => {
      state.error = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signInErrorTimeout } =
  userSlice.actions;
export default userSlice.reducer;
