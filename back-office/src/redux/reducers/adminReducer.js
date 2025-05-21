import { createSlice } from '@reduxjs/toolkit';

export const adminReducer = createSlice({
  name: 'admin',
  initialState: {
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
    admins: [],      
    error: null,
    loading: false,
  },
  reducers: {
    // Auth
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },

    // Get All Admins
    getAdminsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAdminsSuccess: (state, action) => {
      state.admins = action.payload;
      state.loading = false;
    },
    getAdminsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add Admin
    addAdminSuccess: (state, action) => {
      state.admins.push(action.payload);
    },
    addAdminFailure: (state, action) => {
      state.error = action.payload;
    },

    // Update Admin
    updateAdminSuccess: (state, action) => {
      const index = state.admins.findIndex(admin => admin._id === action.payload._id);
      if (index !== -1) {
        state.admins[index] = action.payload;
      }
    },
    updateAdminFailure: (state, action) => {
      state.error = action.payload;
    },

    // Delete Admin
    deleteAdminSuccess: (state, action) => {
      state.admins = state.admins.filter(admin => admin._id !== action.payload);
    },
    deleteAdminFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  getAdminsStart,
  getAdminsSuccess,
  getAdminsFailure,
  addAdminSuccess,
  addAdminFailure,
  updateAdminSuccess,
  updateAdminFailure,
  deleteAdminSuccess,
  deleteAdminFailure,
} = adminReducer.actions;

export default adminReducer.reducer;
