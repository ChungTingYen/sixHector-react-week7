import { useDispatch } from "react-redux";
import { setIsShowToastSlice } from "../slice/toastSlice";
const useToast = ()=>{
  const dispatch = useDispatch();
  const updateToastInfo = (text,type,isShowToast)=>{
    dispatch(setIsShowToastSlice({
      toastInfo:{
        text: text,
        type:type,
        isShowToast: isShowToast,
      }
    }));
  };
  return updateToastInfo;
};
export default useToast;