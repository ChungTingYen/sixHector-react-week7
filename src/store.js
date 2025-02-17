import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';
export default configureStore({
  reducer:{
    toastAtStore:toastReducer
  }
});