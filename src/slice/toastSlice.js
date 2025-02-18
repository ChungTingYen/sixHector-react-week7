import { createSlice } from "@reduxjs/toolkit";
import { toastSliceDefaultValue } from '../data/defaultValue';
export const toastSlice = createSlice({
  name:'toastSlice',
  initialState:
    toastSliceDefaultValue
  ,
  reducers:{
    setIsShowToastSlice(state,action){
      console.log('setIsShowToast,state.toastInfo:',state.toastInfo.isShowToast);
      console.log('setIsShowToast, state.toastInfo:', JSON.stringify(state.toastInfo));
      state.toastInfo = {
        ...state.toastInfo,
        ...action.payload.toastInfo
      };

      console.log('action.payload:',action.payload);
    }
  }
});

export const { setIsShowToastSlice }  = toastSlice.actions;
export default toastSlice.reducer;
