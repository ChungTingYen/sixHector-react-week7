/* eslint-disable react/prop-types */
import { apiService } from "../../apiService/apiService";
const APIPath = import.meta.env.VITE_API_PATH;
import { useDispatch } from "react-redux";
import { setIsShowToastSlice } from "../../slice/toastSlice";
const Carts = (props) => {
  const { cart, handleDeleteCart,setIsLoading,setReload } = props;
  const dispatch = useDispatch();
  const handleIncreDecreProduct = async (cartId, type) => {
    setIsLoading(true);
    try {
      const putData = {
        data: {
          product_id: cart.product.id,
          qty: type === "+" ? cart.qty + 1 : cart.qty - 1,
        },
      };
      await apiService.axiosPut(`/api/${APIPath}/cart/${cartId}`, putData);
      setReload(true);
      dispatch(setIsShowToastSlice({
        toastInfo:{
          type:"warning",
          text:`${type === '+' ? '增加商品數量完成' : '減少商品數量完成'}`,
          isShowToast:true
        }
      }));
    } catch (error) {
      console.log(error);
      dispatch(setIsShowToastSlice({
        toastInfo:{
          type:"warning",
          text:'數量變更失敗',
          isShowToast:true
        }
      }));
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <tr>
        <td style={{ height: "100px" }}>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => handleDeleteCart(cart.id)}
            style={{ width: "80%", height: "80%" }}
          >
            刪除
          </button>
        </td>
        <td>{cart.product.title}</td>
        <td
          style={{
            width: "100px",
            height: "100px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            className="img-fluid"
            src={cart.product.imageUrl}
            alt={cart.product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </td>
        <td>
          <div className="d-flex justify-content-center">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-outline-dark btn-sm ${
                  cart.qty <= 1 ? "bg-secondary" : ""
                }`}
                onClick={() => handleIncreDecreProduct(cart.id, "-")}
                disabled={cart.qty <= 1 && true}
              >
                -
              </button>
              <span
                className="btn border border-dark"
                style={{ width: "50px", cursor: "auto" }}
              >
                {cart.qty}
              </span>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm"
                onClick={() => handleIncreDecreProduct(cart.id, "+")}
              >
                +
              </button>
              <span className="input-group-text bg-transparent border-0">
                {cart.product.unit}
              </span>
            </div>
          </div>
        </td>
        <td className="text-end">{cart.total}</td>
      </tr>
    </>
  );
};

export default Carts;
