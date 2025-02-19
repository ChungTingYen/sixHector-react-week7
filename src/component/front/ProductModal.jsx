/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { apiService } from "../../apiService/apiService";
import { Modal } from "bootstrap";
const APIPath = import.meta.env.VITE_API_PATH;
import { useDispatch } from "react-redux";
import { setIsShowToastSlice } from "../../slice/toastSlice";
const ProductModal = (props) => {
  const {
    tempProduct,
    setIsProductModalOpen,
    isProductModalOpen,
  } = props;
  const disptch = useDispatch();
  const productModalRef = useRef(null);
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const closeProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsProductModalOpen(false);
    setQtySelect(1);
  };
  const openProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };
  const addProductTocart = async () => {
    setIsLoading(true);
    try {
      const postData = {
        data: {
          product_id: tempProduct.id,
          qty: qtySelect,
        },
      };
      await apiService.axiosPost(`/api/${APIPath}/cart`,postData);
      disptch(setIsShowToastSlice({
        toastInfo:{
          type:'success',
          text:'執行完成',
          isShowToast:true
        }
      }));
    } catch (error) {
      console.log(error);
      disptch(setIsShowToastSlice({
        toastInfo:{
          type:'error',
          text:'執行失敗',
          isShowToast:true
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (productModalRef.current)
      new Modal(productModalRef.current, { backdrop: false });
  }, []);
  useEffect(() => {
    if (isProductModalOpen) {
      openProductModal();
    }
  }, [isProductModalOpen]);
  return (
    <>
      <div
        ref={productModalRef}
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }}
        className="modal fade"
        id="productModal"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "60%" }}>
          <div className="modal-content " style={{ height: "100%" }}>
            <div className="modal-header">
              <h2 className="modal-title fs-5">
                產品名稱：{tempProduct.title}
              </h2>
              <button
                onClick={closeProductModal}
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-8">
                  <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                  />
                  <p>內容：{tempProduct.content}</p>
                  <p>描述：{tempProduct.description}</p>
                  <p>
                價錢：<span className="text-danger">{tempProduct.price} </span>
                    <span>
                      <del>{tempProduct.origin_price}</del> 元
                    </span>
                  </p>
                </div>
                <div className="col-4">
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
                    {/* {JSON.stringify(product.imagesUrl,null,2)} */}
                    {tempProduct.imagesUrl && tempProduct.imagesUrl
                      .filter((item) => item != "")
                      .map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          className="card-img-top primary-image me-2 mb-1"
                          alt={`更多圖片${index}`}
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                            overflow:"hidden"
                          }}
                        // onClick={() => handleImageClick(image)}
                        />
                      ))}
                  </div>
                </div>
              </div>
              <div className="input-group align-items-center mt-2">
                <label htmlFor="qtySelect">數量：</label>
                <select
                  value={qtySelect}
                  onChange={(e) => setQtySelect(parseInt(e.target.value))}
                  id="qtySelect"
                  className="form-select"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={isLoading}
                onClick={addProductTocart}
              >
                <div>加入購物車ReactLoading</div>
                {isLoading && (
                  <ReactLoading
                    type={"spin"}
                    color={"#000"}
                    height={"1.5rem"}
                    width={"1.5rem"}
                  />
                )}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                aria-label="Close"
                onClick={closeProductModal}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductModal;
