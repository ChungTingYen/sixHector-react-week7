import { useState,useEffect } from "react";
import { toastInfo } from "../data/dataModel";
import { apiService } from "../apiService/apiService";
import { LoadingOverlay,Toast,CustomerInfo,CustomerInfoWithNoCart } from "../component";

const APIPath = import.meta.env.VITE_API_PATH;
export default function CustomerInfoPage(){
  const [isLoading, setIsLoading] = useState(true);
  const [isShowToast, setIsShowToast] = useState(false);
  const [cart, setCart] = useState({});
  const [reload,setReload] = useState(true);
  const setToastContent = (toastText, type) => {
    setIsShowToast(true);
    toastInfo.toastText = toastText;
    toastInfo.type = type;
  };
  useEffect(()=>{
    const getCart = async () => {
      try {
        const {
          data: { data, success, message },
        } = await apiService.axiosGet(`/api/${APIPath}/cart`);
        setCart(data);
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoading(false);
      }
    };
    if(reload){
      getCart();
      setReload(false);
    }
  },[reload]);
  return (
    <>
      <div className="container">
        {cart.carts?.length > 0 ? (
          <CustomerInfo setIsLoading={setIsLoading} setToastContent={setToastContent} 
            setReload={setReload}/>
        ) : <CustomerInfoWithNoCart/>}
      </div>
      {isLoading && <LoadingOverlay />}
      <Toast
        toastText={toastInfo.toastText}
        type={toastInfo.type}
        isShowToast={isShowToast}
        setIsShowToast={setIsShowToast}
      />
    </>
  );
}