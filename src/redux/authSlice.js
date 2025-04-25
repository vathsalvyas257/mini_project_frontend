import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  profileData: {
    email: null,
    role: "player", // Default role can be set here
    name: null,
    phone: null,
    dob: null,
    gender: null,
    profileImage: null,
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;  // Action to store full profile data
    },
    clearUser: (state) => {
      state.user = null;
      state.profileData = initialState.profileData;  // Reset profileData on logout
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser, setProfileData } = authSlice.actions;
export default authSlice.reducer;
