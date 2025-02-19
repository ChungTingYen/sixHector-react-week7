/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { apiServiceAdmin } from "../../apiService/apiService";
//舊context寫法，暫保留
// import { ProductDetailModal } from "../common";
// import * as utils from "../../utils/utils";
const APIPath = import.meta.env.VITE_API_PATH;
import { useFlashModal,useToast } from "../../hook";
export default function OrderDeleteModal(props) {
  const {
    editProduct,
    setModalMode,
    isProductDeleteModalOpen,
    setIsProductDeleteModalOpen,
    getData,
  } = props;
  const deleteModalDivRef = useRef();
  const updateFlashModal = useFlashModal();
  const updateToast = useToast();
  //舊context寫法，暫保留
  // const ProductDetailModalRef = useRef();
  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.hide();
    setModalMode(null);
    setIsProductDeleteModalOpen(false);
  };
  const openDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.show();
  };
  const deleteProductInModal = async () => {
    if (editProduct?.id === null) return;
    closeDeleteModal();
    updateFlashModal('deleting',true);
    //舊context寫法，暫保留
    // utils.modalStatus(ProductDetailModalRef, "刪除中", null, false);
    try {
      await apiServiceAdmin.axiosDelete(
        `/api/${APIPath}/admin/order/${editProduct.id}`
      );
      setModalMode(null);
      getData();
      updateFlashModal('deleting',true);
      updateToast("完成刪除!","primary",true);
    } catch (error) {
      console.error("刪除產品時發生錯誤：", error);
    } finally {
      //舊context寫法，暫保留
      // ProductDetailModalRef.current.close();
      updateFlashModal('closing',false);
      closeDeleteModal();
    }
  };
  useEffect(() => {
    if (deleteModalDivRef.current) {
      new Modal(deleteModalDivRef.current, { backdrop: false });
    }
  }, []);
  useEffect(() => {
    if (isProductDeleteModalOpen) openDeleteModal();
  }, [isProductDeleteModalOpen]);
  return (
    <>
      {/* 舊context寫法，暫保留
      <ProductDetailModal
        ref={ProductDetailModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "300px", height: "200px" }}
        modalImgSize={{ width: "300px", height: "120px" }}
      /> */}
      <div
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ref={deleteModalDivRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除編號
              <span className="text-danger fw-bold">{editProduct.id}</span>{" "}
              的訂單
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteProductInModal}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
