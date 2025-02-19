import { createSlice } from "@reduxjs/toolkit";
import { flashModalDefaultValue } from '../data/defaultValue';
const flashModalSlice = createSlice({
  name:'flashModal',
  initialState:flashModalDefaultValue,
  reducers:{
    setIsShowflashModalSlice(state,action){
      // console.log('setIsShowflashModalSlice,state.flashModalInfo:',state.flashModalInfo);
      // console.log('setIsShowflashModalSlice, state.flashModalInfo:', JSON.stringify(state.flashModalInfo));
      state.flashModalInfo = {
        ...state.flashModalInfo,
        ...action.payload.flashModalInfo
      };
      // console.log('action.payload:',action.payload);
    }
  }
});
export const { setIsShowflashModalSlice } = flashModalSlice.actions;
export default flashModalSlice.reducer;