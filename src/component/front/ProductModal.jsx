/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { apiService } from "../../apiService/apiService";
import { Modal } from "bootstrap";
import { Modal as PicModal } from "../../component/common";
const APIPath = import.meta.env.VITE_API_PATH;
import { useToast } from '../../hook';
const ProductModal = (props) => {
  const {
    tempProduct,
    setIsProductModalOpen,
    isProductModalOpen,
  } = props;
  const updateToast = useToast();
  const productModalRef = useRef(null);
  const picModalRef = useRef(null);
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
      updateToast('執行完成','success',true);
    } catch (error) {
      console.log(error);
      updateToast('執行失敗','error',true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageClick = (imageSrc) => {
    picModalRef.current.setModalImage(imageSrc);
    picModalRef.current.open();
  };
  useEffect(() => {
    if (productModalRef.current){
      const modalElement = productModalRef.current;
      new Modal(productModalRef.current, { backdrop: true });

      const handleClose = ()=>{
        setIsProductModalOpen(false);
        setQtySelect(1);
      };
      modalElement.addEventListener('hidden.bs.modal', handleClose);

      return () => {
        modalElement.removeEventListener('hidden.bs.modal', handleClose);
      };
    }
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
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "70%" }}>
          <div className="modal-content">
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
                    style={{ width: '100%',height:'100%' }}
                  />
                </div>
                <div  className="col-4">
                  <p>內容：{tempProduct.content}</p>
                  <p>描述：{tempProduct.description}</p>
                  <p>
                     價錢：<span className="text-danger">{tempProduct.price} </span>
                    <span>
                      <del>{tempProduct.origin_price}</del> 元
                    </span>
                  </p>
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
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center gap-2"
                      disabled={isLoading}
                      onClick={addProductTocart}
                    >
                      <div>加入購物車</div>
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
                      關閉視窗
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
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
                            overflow:"hidden",
                            cursor: "pointer", // 這裡設置光標為手指圖樣
                          }}
                          onClick={() => handleImageClick(image)}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                aria-label="Close"
                onClick={closeProductModal}
              >
                關閉視窗
              </button>
            </div>
          </div>
        </div>
      </div>
      <PicModal
        ref={picModalRef}
        modalBodyText="商品放大圖"
        modalSize={{ width: "600px", height: "800px" }}
        modalImgSize={{ width: "600px", height: "600px" }}
      />
    </>
  );
};
export default ProductModal;
