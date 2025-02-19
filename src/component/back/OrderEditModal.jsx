/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, Fragment, memo } from "react";
import { Modal } from "bootstrap";
import { apiServiceAdmin } from "../../apiService/apiService";
import { orderDefaultValue } from "../../data/defaultValue";
import { InputField } from ".";
const APIPath = import.meta.env.VITE_API_PATH;
import { useToast,useFlashModal } from '../../hook';
function OrderEditModal(props) {
  const editModalDivRef = useRef();
  const updateToast = useToast();
  const updateFlashModal = useFlashModal();
  const {
    editProduct,
    setModalMode,
    isModalOpen,
    setIsModalOpen,
    getData,
    editOrderId,
  } = props;
  const [modalOrder, setModalOrder] = useState(orderDefaultValue);
  const userColumn = [
    {
      name: "name",
      type: "text",
      label: "姓名",
      value: modalOrder.data?.user.name,
    },
    {
      name: "email",
      type: "email",
      label: "電子郵件",
      value: modalOrder.data?.user.email,
    },
    {
      name: "address",
      type: "text",
      label: "地址",
      value: modalOrder.data?.user.address,
    },
    {
      name: "tel",
      type: "text",
      label: "電話",
      value: modalOrder.data?.user.tel,
    },
    {
      name: "is_paid",
      type: "checkbox",
      label: "付款，",
      checked: modalOrder.data?.is_paid,
    },
  ];

  const handleEditDataChange = (e, key = null) => {
    const { name, type, value, checked } = e.target;
    let temp = orderDefaultValue;
    if (key !== null) {
      const newQty = parseInt(value) <= 0 ? 1 : parseInt(value);
      const newProduct = {
        ...modalOrder.data.products[key],
        qty: newQty,
        final_total: newQty * modalOrder.data.products[key].product.price,
        total: newQty * modalOrder.data.products[key].product.price,
      };
      const updateProducts = {
        ...modalOrder.data.products,
        [key]: newProduct,
      };
      const updateTotal = Object.values(updateProducts).reduce(
        (acc, product) => {
          return acc + product.final_total;
        },
        0
      );
      temp = {
        ...modalOrder,
        data: {
          ...modalOrder.data,
          products: updateProducts,
          total: updateTotal,
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
    setModalOrder(temp);
  };
  const handleUpdateOrder = async () => {
    if (!editOrderId.current) {
      alert("未取得order ID");
      return;
    }
    updateFlashModal("loading",true);
    try {
      await apiServiceAdmin.axiosPut(
        `/api/${APIPath}/admin/order/${editOrderId.current}`,
        modalOrder
      );
      setIsModalOpen(false);
      getData();
      updateToast("更新完成","primary",true);
    } catch (error) {
      console.log(error);
    } finally {
      closeEditModal();
      setModalOrder(orderDefaultValue);
      updateFlashModal("closing",false);
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
              <p>客戶資料:</p>
              {userColumn.map((column) => (
                <InputField
                  key={column.name}
                  label={column.label}
                  name={column.name}
                  type={column.type}
                  checked={column.checked}
                  value={column.value}
                  onChange={handleEditDataChange}
                />
              ))}
              <div className="mb-3">
                <label htmlFor="unit" className="form-label">
                  客戶的留言:
                </label>
                <span>{modalOrder.data?.message}</span>
              </div>
              <hr />
              <div className="mb-3">
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
              </div>
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
    </>
  );
}
export default memo(OrderEditModal);
