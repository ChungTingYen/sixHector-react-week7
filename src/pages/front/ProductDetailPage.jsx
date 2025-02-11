import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { apiService } from "../../apiService/apiService";
import { setToastContent } from "../../utils/utils";
import { toastInfo } from "../../data/dataModel";
import { Modal } from "../../component/common";
import { Toast } from '../../component/common';
const APIPath = import.meta.env.VITE_API_PATH;
export default function ProductDetailPage() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isShowToast,setIsShowToast] = useState(false);
  const modalRef = useRef(null);
  const handleImageClick = (imageSrc) => {
    modalRef.current.setModalImage(imageSrc);
    modalRef.current.open();
  };
  const getProductById = async () => {
    // setIsLoading(true);
    try {
      const {
        data: { product, success, message },
      } = await apiService.axiosGet(`/api/${APIPath}/product/${productId}`);
      setProduct(product);
    } catch (error) {
      console.log(error);
    } finally {
      //   setIsLoading(false);
    }
  };
  const addProductTocart = async () => {
    setIsButtonLoading(true);
    try {
      const postData = {
        data: {
          product_id: productId,
          qty: qtySelect,
        },
      };
      await apiService.axiosPost(`/api/${APIPath}/cart`,postData);
      // setReload(true);
      // closeProductModal();
      setToastContent(setIsShowToast,toastInfo,"執行完成", "success");
    } catch (error) {
      console.log(error);
      setToastContent(setIsShowToast,toastInfo,"執行失敗", "error");
    } finally {
      setIsButtonLoading(false);
    }
  };
  useEffect(() => {
    getProductById();
  }, []);
  return (
    <>
      <div className="container p-5">
        <div className="row">
          <div className="col-6">
            <img
              className="img-fluid"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            <p className="mb-3">{product.content}</p>
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(parseInt(e.target.value))}
                id="qtySelect"
                className="form-select"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={isButtonLoading}
                onClick={addProductTocart}
              >
                <div>加入購物車</div>
                {isButtonLoading && (
                  <ReactLoading
                    type={"spin"}
                    color={"#000"}
                    height={"1.5rem"}
                    width={"1.5rem"}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <h5 className="mt-3">更多圖片：</h5>
        <div className="d-flex flex-wrap">
          {product.imagesUrl && product.imagesUrl
            .filter((item) => item != "")
            .map((image, index) => (
              <img
                key={index}
                src={image}
                className="card-img-top primary-image me-2 mb-1"
                alt={`更多圖片${index}`}
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover",
                  cursor: "pointer", // 這裡設置光標為手指圖樣
                }}
                onClick={() => handleImageClick(image)}
              />
            
            ))}
        </div>
      </div>
      <Toast
        toastText={toastInfo.toastText}
        type={toastInfo.type}
        isShowToast={isShowToast}
        setIsShowToast={setIsShowToast}
      />
      <Modal
        ref={modalRef}
        modalBodyText="商品放大圖"
        modalSize={{ width: "600px", height: "600px" }}
        modalImgSize={{ width: "500px", height: "500px" }}
      />
    </>
  );
}
