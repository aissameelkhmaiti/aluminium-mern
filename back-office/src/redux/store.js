// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/reducers/adminReducer';

 

export  const store = configureStore({
  reducer: {
    auth: authReducer,

  },
});