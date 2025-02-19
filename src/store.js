import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';
import FlashModalReducer from './slice/flashModalSlice';
export default configureStore({
  reducer:{
    toastAtStore:toastReducer,
    flashModalAtStore:FlashModalReducer
  }
});