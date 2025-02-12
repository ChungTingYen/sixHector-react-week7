/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
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
    setModalMode(null);
    setModalProduct({});
    const modalInstance = Modal.getInstance(editModalDivRef.current);
    modalInstance.hide();
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (editModalDivRef.current) {
      new Modal(editModalDivRef.current, { backdrop: true });
    }
  }, []);
  useEffect(() => {
    setModalProduct(editProduct);
  }, [editProduct]);

  useEffect(() => {
    if (isModalOpen) openEditModal();
  }, [isModalOpen]);
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
              <h5 className="modal-title fs-4">{modalProduct.id}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeEditModal}
                data-bs-dismiss="modal"
              ></button>
            </div>
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
                      <li>留下的訊息:{modalProduct.message}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default OrderEditModal;
