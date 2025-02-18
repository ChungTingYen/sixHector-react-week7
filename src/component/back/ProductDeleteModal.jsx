/* eslint-disable react/prop-types */
import { useEffect, useRef, memo } from "react";
import { Modal } from "bootstrap";
import { apiServiceAdmin } from "../../apiService/apiService";
import * as utils from "../../utils/utils";
import { ProductDetailModal } from "../common";
import { useToast } from "./ToastContext";
const APIPath = import.meta.env.VITE_API_PATH;
import { useDispatch } from "react-redux";
import { setIsShowToastSlice } from "../../slice/toastSlice";

const ProductDeleteModal = (props) => {
  const {
    editProduct,
    setModalMode,
    isProductDeleteModalOpen,
    setIsProductDeleteModalOpen,
    getProductData,
  } = props;
  const { setProductDetailModalType } = useToast();
  const deleteModalDivRef = useRef(null);
  const ProductDetailModalRef = useRef(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (deleteModalDivRef.current) {
      new Modal(deleteModalDivRef.current, { backdrop: false });
    }
  }, []);
  useEffect(() => {
    if (isProductDeleteModalOpen) openDeleteModal();
  }, [isProductDeleteModalOpen]);

  const openDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.show();
  };
  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalDivRef.current);
    modalInstance.hide();
    setModalMode(null);
    setIsProductDeleteModalOpen(false);
  };
  const deleteProductInModal = async () => {
    if (editProduct?.id === null) return;
    closeDeleteModal();
    setProductDetailModalType("deleting");
    utils.modalStatus(ProductDetailModalRef, "刪除中", null, false);
    try {
      await apiServiceAdmin.axiosDeleteProduct(
        `/api/${APIPath}/admin/product/${editProduct.id}`
      );
      setModalMode(null);
      getProductData();
      dispatch(
        setIsShowToastSlice({
          toastInfo: {
            toastText: "完成刪除!",
            type: "warning",
            isShowToast: true,
          },
        })
      );
    } catch (error) {
      console.error("刪除產品時發生錯誤：", error);
    } finally {
      ProductDetailModalRef.current.close();
      closeDeleteModal();
    }
  };
  return (
    <>
      <ProductDetailModal
        ref={ProductDetailModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "300px", height: "200px" }}
        modalImgSize={{ width: "300px", height: "120px" }}
      />
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
              你是否要刪除
              <span className="text-danger fw-bold">{editProduct.title}</span>
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
};

export default memo(ProductDeleteModal);
