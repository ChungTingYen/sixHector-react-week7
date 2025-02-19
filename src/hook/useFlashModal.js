import { useDispatch } from "react-redux";
import { setIsShowflashModalSlice } from '../slice/flashModalSlice';
const useFlashModal = ()=>{
  const dispatch = useDispatch();
  const updateFlashModal = (text,isShowFlashModal)=>{
    dispatch(setIsShowflashModalSlice({
      flashModalInfo:{
        text: text,
        isShowFlashModal: isShowFlashModal,
      }
    }));
  };
  return updateFlashModal;
};
export default useFlashModal;