/* eslint-disable react/prop-types */
import { useRef, useState, useEffect,Fragment } from "react";
import { Modal } from "bootstrap";
// import { apiServiceAdmin } from "../../apiService/apiService";
// import * as utils from "../../utils/utils";
function OrderEditModal(props) {
  const editModalDivRef = useRef();
  const {
    editProduct,
    setModalMode,
    modalMode,
    getOrderData,
    isModalOpen,
    setIsModalOpen,
  } = props;
  const [modalProduct, setModalProduct] = useState(editProduct);
  const openEditModal = () => {
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.show();
    setIsModalOpen(false);
  };
  const closeEditModal = () => {
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.hide();
    setIsModalOpen(false);
    setModalMode(null);
  };
  useEffect(() => {
    if (editModalDivRef.current) {
      new Modal(editModalDivRef.current, { backdrop: true });
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      if(Object.keys(editProduct).length > 0)
        setModalProduct(editProduct);
      openEditModal();
    }
  }, [isModalOpen,editProduct]);

  return (
    <>
      <div
        id="productModal"
        className="modal fade"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        ref={editModalDivRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">訂單ID:{modalProduct.id}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeEditModal}
                // data-bs-dismiss="modal"
              ></button>
            </div>
            {Object.keys(modalProduct).length > 0 &&
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="mb-3">
                    <ul className="list-group">
                      <li
                        className={`fw-bold ${
                          modalProduct.is_paid ? "text-success" : "text-danger "
                        }`}
                      >
                        {modalProduct.is_paid ? "已付款" : "未付款"}
                      </li>
                    </ul>
                    {
                      Object.entries(modalProduct.products).map(([key, value],index) => {
                        return (
                          <Fragment key={key}>
                            <span className="text-primary" >訂購商品{index + 1}:</span>
                            <ul className="list-group" >
                              <li>Product ID: {key}</li>
                              <li>Product Title: {value.product.title}</li>
                              <li>Product Category: {value.product.category}</li>
                              <li>Product qty: {value.qty}</li>
                              <li>Product Origin Price: {value.product.origin_price}</li>
                              <li>Product Price: {value.product.price}</li>
                              <li>Product Total: {value.total}</li>
                            </ul>
                            <hr />
                          </Fragment>
                        );
                      })
                    }
                    <p>總計:{modalProduct.total}</p>
                  </div>
                </div>
              </div>
            </div>
            }
            {Object.keys(modalProduct).length > 0 && (<>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <span className="text-success fw-bold">客戶資料:</span>
                      <ul className="list-group">
                        <li>
                          name:{modalProduct.user.name}
                        </li>
                        <li>
                          tel:{modalProduct.user.tel}
                        </li>
                        <li>
                          email:{modalProduct.user.email}
                        </li>
                        <li>
                          address:{modalProduct.user.address}
                        </li>
                        <li>留下的訊息:{modalProduct.message}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>)
            }
          </div>
        </div>
      </div>
    </>
  );
}
export default OrderEditModal;
