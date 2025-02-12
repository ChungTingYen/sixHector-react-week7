import { useEffect, useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../apiService/apiService";
import { toastInfo } from '../../data/dataModel';
import { Carts,LoadingOverlay } from "../../component/front";
import { Toast } from "../../component/common";
import { useNavigatePage } from '../../hook';
const APIPath = import.meta.env.VITE_API_PATH;
export default function CartPage(){
  const [cart, setCart] = useState({});
  const [reload, setReload] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowToast, setIsShowToast] = useState(false);
  const setToastContent = (toastText, type) => {
    setIsShowToast(true);
    toastInfo.toastText = toastText;
    toastInfo.type = type;
  };
  const navigate = useNavigatePage();
  const handleDeleteCart = useCallback(async (cartId = null) => {
    //如果有cardId就是刪除一個，沒有就是刪除全部
    const path = `api/${APIPath}/cart` + (cartId ? `/${cartId}` : "s");
    setIsLoading(true);
    try {
      await apiService.axiosDelete(path);
      setReload(true);
      setToastContent("刪除商品完成", "success");
    } catch (error) {
      console.log(error);
      alert(error);
      setToastContent("刪除商品失敗", "error");
    } finally {
      setIsLoading(false);
    }
  },[]);
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

  useEffect(()=>{
    if(reload){
      getCart();
      setReload(false);
    }
  },[reload]);
  return (
    <>
      <div className="container">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>刪除</th>
              <th style={{ width: "30%" }}>品名</th>
              <th>圖片</th>
              <th className="text-center">數量 / 單位</th>
              <th className="text-end">單價</th>
            </tr>
          </thead>
          <tbody>
            {cart.carts?.length > 0 &&
                  cart.carts.map((cart) => (
                    <Carts
                      key={cart.id}
                      cart={cart}
                      handleDeleteCart={handleDeleteCart}
                      setIsLoading={setIsLoading}
                      setReload={setReload} 
                      setToastContent={setToastContent}
                    />
                  ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                
              </td>
              <td colSpan="6" className="text-end">
                  總計：{cart.total}
              </td>
            </tr>
          </tfoot>
        </table>
        {cart.carts?.length > 0 ? (
          <>
            <div className="row" style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-danger"
                disabled={cart.carts?.length <= 0}
                style={{ width: "20%" }}
                onClick={() => handleDeleteCart(null)}
              >
                刪除購物車
              </button>
              <button className="btn btn-primary" style={{ width: "20%" }}
                onClick={()=>navigate('/customerInfo')}>
                填寫訂單資料
              </button>
            </div>
          </>
        ) : (
          <span className="text-start">購物車沒有商品</span>
        )}
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