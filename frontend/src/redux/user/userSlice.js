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
    updateUserStart: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteUserStart: (state) => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
    },
    //Signout is same as delete - Can combine the reducers. Keeping seperate to understand logic better
    signOutUserStart: (state) => {
      state.isLoading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
    },
    signOuUserFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signInErrorTimeout,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
