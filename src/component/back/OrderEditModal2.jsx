/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, Fragment, memo } from "react";
import { Modal } from "bootstrap";
import { apiServiceAdmin } from "../../apiService/apiService";
import { orderDefaultValue } from "../../data/defaultValue";
import { ProductDetailModal, Toast } from "../common";
import * as utils from "../../utils/utils";
import { useToast } from "./ToastContext";
import { toastInfo } from "../../data/dataModel";
const APIPath = import.meta.env.VITE_API_PATH;
function OrderEditModal2(props) {
  const editModalDivRef = useRef();
  const {
    editProduct,
    setModalMode,
    isModalOpen,
    setIsModalOpen,
    getData,
    editOrderId,
  } = props;
  const [modalOrder, setModalOrder] = useState(orderDefaultValue);
  const ProductDetailModalRef = useRef(null);
  const { setIsShowToast, setProductDetailModalType } = useToast();
  useEffect(() => {
    console.log("edit");
  });
  const handleEditDataChange = (e, key = null) => {
    const { name, type, value, checked } = e.target;
    let temp = orderDefaultValue;
    if (key !== null) {
      temp = {
        ...modalOrder,
        data: {
          ...modalOrder.data,
          products: {
            ...modalOrder.data.products,
            [key]: {
              ...modalOrder.data.products[key],
              qty: parseInt(value) <= 0 ? 1 : parseInt(value), // 將 value 替換為你想要設定的新數量
            },
          },
        },
      };
    } else if (name === "is_paid") {
      temp = {
        ...modalOrder,
        data: {
          ...modalOrder.data,
          is_paid: checked,
        },
      };
    } else {
      temp = {
        ...modalOrder,
        data: {
          ...modalOrder.data,
          user: {
            ...modalOrder.data.user,
            [name]: value,
          },
        },
      };
    }
    // if (type === "number") tempValue = Number(value);
    // else if (type === "checkbox") tempValue = checked;
    // else tempValue = value;
    console.log("temp=", temp);
    setModalOrder(temp);
  };
  const handleUpdateOrder = async () => {
    // console.log("editOrderId.current=", editOrderId.current);
    // console.log("modalOrder=", modalOrder);
    if (!editOrderId.current) {
      alert("未取得order ID");
      return;
    }
    setProductDetailModalType("loading");
    utils.modalStatus(ProductDetailModalRef, "進行中", null, false);
    try {
      // const result = await implementEditProduct(modalMode, modalOrder);
      const res = await apiServiceAdmin.axiosPut(
        `/api/${APIPath}/admin/order/${editOrderId.current}`,
        modalOrder
      );
      setIsModalOpen(false);
      getData();
      setIsShowToast(true);
      toastInfo.type = "success";
      toastInfo.toastText = "更新完成";
    } catch (error) {
      console.log(error);
    } finally {
      closeEditModal();
      setModalOrder(orderDefaultValue);
      ProductDetailModalRef.current.close();
    }
  };
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
      if (Object.keys(editProduct).length > 0) setModalOrder(editProduct);
      openEditModal();
    }
    console.log("modalOrder=", modalOrder);
  }, [isModalOpen, editProduct]);

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
              <h5 className="modal-title fs-4">
                訂單內容:{editOrderId.current}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeEditModal}
                // data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="form-check">
                  <input
                    name="is_paid"
                    type="checkbox"
                    className="form-check-input"
                    id="isPaid"
                    checked={modalOrder.data?.is_paid}
                    onChange={handleEditDataChange}
                  />
                  <label className="form-check-label" htmlFor="isPaid">
                    付款，
                  </label>
                  <span
                    className={!modalOrder.is_paid && "text-danger fw-bold"}
                  >
                    目前狀態:{modalOrder.data?.is_paid ? "已付款" : "未付款"}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="unit" className="form-label">
                  客戶的留言:
                </label>
                <span>{modalOrder.data?.message}</span>
              </div>
              <span>客戶資料:</span>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  姓名
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="form-control"
                  value={modalOrder.data?.user.name}
                  onChange={handleEditDataChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  電話
                </label>
                <input
                  name="tel"
                  id="tel"
                  type="text"
                  className="form-control"
                  value={modalOrder.data?.user.tel}
                  onChange={handleEditDataChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  地址
                </label>
                <input
                  name="address"
                  id="address"
                  type="text"
                  className="form-control"
                  value={modalOrder.data?.user.address}
                  onChange={handleEditDataChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  type="text"
                  className="form-control"
                  value={modalOrder.data?.user.email}
                  onChange={handleEditDataChange}
                />
              </div>
              <span className="text-success fw-bold">訂購商品資料:</span>
              {Object.entries(modalOrder.data?.products).map(
                ([key, value], index) => (
                  <Fragment key={key}>
                    <div className="mb-3">
                      <label className="form-label">Order list id</label>
                      <input
                        name={key}
                        id={key}
                        type="text"
                        className="form-control"
                        value={key}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Product id</label>
                      <input
                        name={value.product_id}
                        id={value.product_id}
                        type="text"
                        className="form-control"
                        value={value.product_id}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`qty${index}`} className="form-label">
                        qty
                      </label>
                      <input
                        name={`qty${index}`}
                        id={`qty${index}`}
                        type="number"
                        className="form-control"
                        value={value.qty}
                        onChange={(e) => handleEditDataChange(e, key)}
                      />
                    </div>
                    <hr />
                  </Fragment>
                )
              )}
              <div className="modal-footer border-top bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label="Close"
                  onClick={closeEditModal}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateOrder}
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductDetailModal
        ref={ProductDetailModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "300px", height: "200px" }}
        modalImgSize={{ width: "300px", height: "120px" }}
      />
      <Toast toastText={toastInfo.toastText} type={toastInfo.type} />
    </>
  );
}
export default memo(OrderEditModal2);
