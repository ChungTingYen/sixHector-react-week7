/* eslint-disable react/prop-types */
import { useRef, useState, useEffect,Fragment } from "react";
import { Modal } from "bootstrap";
// import { apiServiceAdmin } from "../../apiService/apiService";
// import * as utils from "../../utils/utils";
function OrderEditModal2(props) {
  const editModalDivRef = useRef();
  const {
    editProduct,
    setModalMode,
    isModalOpen,
    setIsModalOpen,
  } = props;
  const [modalProduct, setModalProduct] = useState({
    data:{
      create_at: "",
      is_paid: 0,
      message: "",
      products: {},
      user: {
        name: "",
        tel: "",
        email: "",
        address: ""
      },
      num: ""
    }
  });
  const handleEditDataChange = (e,key = null) => {
    const { name, type, value, checked } = e.target;
    let tempValue;
    if (type === "number") tempValue = Number(value);
    else if (type === "checkbox") tempValue = checked;
    else tempValue = value;
    if (key !== null) {
      const temp = {
        ...modalProduct,
        data: {
          ...modalProduct.data,
          products: {
            ...modalProduct.data.products,
            [key]: {
              ...modalProduct.data.products[key],
              qty: value < 0 ? 1 : value // 將 value 替換為你想要設定的新數量
            }
          }
        }
      };
      console.log('temp=', temp);
      setModalProduct(temp);
    } else if(name === 'is_paid'){
      console.log(name);
      const temp = {
        ...modalProduct,
        data: {
          ...modalProduct.data,
          is_paid: tempValue ? 1 : 0, 
        }
      };
      console.log('temp=', temp);
      setModalProduct(temp);
    }
    console.log(name);
    // const temp = {
    //   ...modalProduct.products,
    //   [name]: tempValue,
    // };
    // setModalProduct(temp);
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
      if(Object.keys(editProduct).length > 0)
        setModalProduct(editProduct);
      openEditModal();
    }
    console.log('modalProduct=',modalProduct);
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
              <h5 className="modal-title fs-4">訂單內容</h5>
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
                    checked={modalProduct.data?.is_paid}
                    onChange={handleEditDataChange}
                  />
                  <label className="form-check-label" htmlFor="isPaid">
                      付款，
                  </label>
                  <span className={!modalProduct.is_paid && 'text-danger fw-bold'}>
                      目前狀態:{modalProduct.data?.is_paid ? '已付款' : '未付款'}</span>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="unit" className="form-label">
                  客戶的留言:
                </label>
                <span>{modalProduct.data?.message}</span>
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
                  value={modalProduct.data?.user.name}
                  // onChange={handleEditDataChange}
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
                  value={modalProduct.data?.user.tel}
                  // onChange={handleEditDataChange}
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
                  value={modalProduct.data?.user.address}
                  // onChange={handleEditDataChange}
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
                  value={modalProduct.data?.user.email}
                  // onChange={handleEditDataChange}
                />
              </div>
              <span className="text-success fw-bold">訂購商品資料:</span>
              {
                Object.entries(modalProduct.data?.products).map(([key, value], index) => (
                  <Fragment key={key}>
                    <div className="mb-3">
                      <label  className="form-label">
                        Order list id
                      </label>
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
                      <label  className="form-label">
                        Product id
                      </label>
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
                        onChange={(e)=>handleEditDataChange(e,key)}
                      />
                    </div>
                    <hr/>
                  </Fragment>
                ))
              }
            
              {/* {Object.keys(modalProduct).length > 0 &&
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
                              <li>Order product list ID: {key}</li>
                              <li>Product product ID: {value.product.id}</li>
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
            } */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default OrderEditModal2;
