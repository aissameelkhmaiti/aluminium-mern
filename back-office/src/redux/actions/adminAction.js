import axios from 'axios';
import {
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
} from '../reducers/adminReducer';

// Login Admin
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    dispatch(loginSuccess(token));
    return 'success';
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || error.message));
  }
};

// Get All Admins
export const fetchAllAdmins = () => async (dispatch) => {
  dispatch(getAdminsStart());
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAdminsSuccess(res.data));
  } catch (error) {
    dispatch(getAdminsFailure(error.response?.data?.message || error.message));
  }
};

// Add Admin
export const addAdmin = (adminData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3001/api/user/register', adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(addAdminSuccess(res.data));
    return 'success';
  } catch (error) {
    dispatch(addAdminFailure(error.response?.data?.message || error.message));
  }
};

// Update Admin
export const updateAdmin = (adminId, adminData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(`http://localhost:3001/api/admins/${adminId}`, adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(updateAdminSuccess(res.data));
    return 'success';
  } catch (error) {
    dispatch(updateAdminFailure(error.response?.data?.message || error.message));
  }
};

// Delete Admin
export const deleteAdmin = (adminId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:3001/api/admins/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(deleteAdminSuccess(adminId));
    return 'success';
  } catch (error) {
    dispatch(deleteAdminFailure(error.response?.data?.message || error.message));
  }
};
