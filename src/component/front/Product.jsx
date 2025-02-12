/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { apiService } from "../../apiService/apiService";

// import { useLoading } from "./LoadingContext";
const APIPath = import.meta.env.VITE_API_PATH;
const Product = (props) => {
  const { product, handleSeeMore, setIsLoading, setToastContent } = props;
  // const { setReload, setIsLoading, setToastContent } = useLoading();
  const atHandleSeeMore = () => {
    handleSeeMore(product.id);
  };
  const handleAddProductToCart = async () => {
    setIsLoading(true);
    try {
      const postData = {
        data: {
          product_id: product.id,
          qty: 1,
        },
      };
      await apiService.axiosPost(`/api/${APIPath}/cart`, postData);
      // setReload(true);
      setToastContent("執行完成", "success");
    } catch (error) {
      console.log(error);
      setToastContent("執行失敗", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (<>
    <tr>
      <td
        style={{
          width: "150px",
          height: "150px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={atHandleSeeMore}
      >
        <img
          className="img-fluid"
          src={product.imageUrl}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </td>
      <td>{product.title}</td>
      <td>
        <del className="h6">原價 {product.origin_price} 元</del>
        <div className="h5 text-danger">特價 {product.price} 元</div>
      </td>
      <td>
        {/* <div className="btn-group btn-group-sm">
          <button
            onClick={atHandleSeeMore}
            type="button"
            className="btn btn-outline-secondary"
          >
            查看更多(Modal)
          </button>
          <Link
            to={`/product/${product.id}`}
            className="btn btn-outline-secondary"
          >
            查看更多(別頁)
          </Link>
          <Link
            to={`/products/productBySide/${product.id}`}
            className="btn btn-outline-secondary"
          >
            查看更多(右側)
          </Link>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleAddProductToCart}
          >
            加到購物車
          </button>
        </div> */}
      </td>
    </tr>
    <tr>
      <td colSpan="3">
        <span><b>功能</b></span>
        <div className="btn-group btn-group-sm d-flex">
          <button
            onClick={atHandleSeeMore}
            type="button"
            className="btn btn-outline-secondary"
          >
            查看更多(Modal)
          </button>
          <Link
            to={`/product/${product.id}`}
            className="btn btn-outline-secondary"
          >
            查看更多(別頁)
          </Link>
          <Link
            to={`/products/productBySide/${product.id}`}
            className="btn btn-outline-secondary"
          >
            查看更多(右側)
          </Link>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleAddProductToCart}
          >
            加到購物車
          </button>
        </div>
      </td>
    </tr>
  </>
  );
};
export default Product;
