import { useState, useEffect } from "react";
import { apiService } from "../../apiService/apiService";
import {
  LoadingOverlay,
  CustomerInfo,
  CustomerInfoWithNoCartNavbar,
} from "../../component/front";
const APIPath = import.meta.env.VITE_API_PATH;
export default function CustomerInfoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [reload, setReload] = useState(true);
  useEffect(() => {
    const getCart = async () => {
      try {
        const {
          data: { data, success, message },
        } = await apiService.axiosGet(`/api/${APIPath}/cart`);
        setCart(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (reload) {
      getCart();
      setReload(false);
    }
  }, [reload]);
  return (
    <>
      <div className="container">
        {cart.carts?.length > 0 ? (
          <CustomerInfo setIsLoading={setIsLoading} setReload={setReload} />
        ) : (
          <CustomerInfoWithNoCartNavbar />
        )}
      </div>
      {isLoading && <LoadingOverlay />}
    </>
  );
}
