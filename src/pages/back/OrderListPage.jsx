import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { apiServiceAdmin } from "../../apiService/apiService";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  Orders,
  OrderViewModal,
  OrderEditModal,
  // 舊context寫法，暫保留
  // ProductDetailModal,
  OrderDeleteModal,
} from "../../component/back";
// 舊context寫法，暫保留
// import * as utils from "../../utils/utils";
// import { ToastContext } from "../../component/back/ToastContext";
const APIPath = import.meta.env.VITE_API_PATH;
import { useFlashModal, } from '../../hook';

export default function OrderListPage() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [modalMode, setModalMode] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // 舊context寫法，暫保留
  // const [productDetailModalType, setProductDetailModalType] = useState("");
  // const ProductDetailModalRef = useRef(null);
  // const toastContextValue = useMemo(
  //   () => ({
  //     setProductDetailModalType,
  //     productDetailModalType,
  //   }),
  //   [setProductDetailModalType, productDetailModalType]
  // );

  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] =
    useState(false);
  const editOrderId = useRef(null);
  const [isLoging, setIsLogin] = useState(false);
  const updateFlashModal = useFlashModal();
  const handleCheckLogin = async () => {
    // 舊context寫法，暫保留
    // setProductDetailModalType("checking");
    // utils.modalStatus(ProductDetailModalRef, "", null, false);
    updateFlashModal("checking",true);
    try {
      await apiServiceAdmin.axiosPost("/api/user/check", {});
      setIsLogin(true);
    } catch (error) {
      console.log(error);
      navigate("/login");
    } finally {
      updateFlashModal("closing",false);
      // 舊context寫法，暫保留
      // ProductDetailModalRef.current.close();
    }
  };
  const handleGetOrders = async () => {
    try {
      await getOrderData();
    } catch (error) {
      console.log(error);
    } 
  };
  const getOrderData = useCallback(async (page = 1) => {
    try {
      const resOrder = await apiServiceAdmin.axiosGetProductDataByConfig(
        `/api/${APIPath}/admin/orders`,
        { params: { page: page, }, }
      );
      setOrderData(
        resOrder.data.orders.filter((order) => {
          return order.id !== undefined;
        })
      );
      setPageInfo(resOrder.data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      editOrderId.current = null;
    }
  }, []);
  const handleDeleteModal = useCallback(
    (orderId) => {
      const updatedOrder =
        orderData.find((order) => order.id === orderId) ?? {};
      setEditProduct(updatedOrder);
      setIsProductDeleteModalOpen(true);
    },
    [orderData]
  );
  const handleOpenOrderModalWithValue = useCallback(
    (mode, orderId = null) => {
      if (mode === "edit") {
        let temp = orderData.find((order) => order.id === orderId);
        let products = { data: temp };
        setEditProduct(products);
        setModalMode(mode);
        setIsEditModalOpen(true);
        editOrderId.current = orderId;
      } else if (orderId && mode === "view") {
        setEditProduct(
          () => orderData.find((order) => order.id === orderId) ?? {}
        );
        setModalMode(mode);
        setIsViewModalOpen(true);
      }
    },
    [orderData]
  );
  useEffect(() => {
    handleCheckLogin();
  }, []);
  useEffect(() => {
    if (isLoging) {
      handleGetOrders();
    }
  }, [isLoging]);
  return (
    <>
      {orderData.length > 0 ? (
        <>
          <div className="row mt-1 mb-2 mx-1">
            <div>
              <h3>產品列表</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th className="col-1">index</th>
                    <th className="col-1">訂單id</th>
                    <th className="col-1">付款</th>
                    <th className="col-1">金額</th>
                    <th className="col-1">功能</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((order, index) => {
                    return (
                      <Orders
                        key={order.id}
                        {...order}
                        index={index}
                        handleOpenOrderModalWithValue={
                          handleOpenOrderModalWithValue
                        }
                        handleDeleteModal={handleDeleteModal}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination getData={getOrderData} pageInfo={pageInfo} />
        </>
      ) : (
        <h1>沒有訂單或訂單載入中</h1>
      )}
      <OrderViewModal
        editProduct={editProduct}
        setModalMode={setModalMode}
        modalMode={modalMode}
        getData={getOrderData}
        isModalOpen={isViewModalOpen}
        setIsModalOpen={setIsViewModalOpen}
      />
      <OrderDeleteModal
        setModalMode={setModalMode}
        modalMode={modalMode}
        getData={getOrderData}
        isProductDeleteModalOpen={isProductDeleteModalOpen}
        setIsProductDeleteModalOpen={setIsProductDeleteModalOpen}
        editProduct={editProduct}
      />
      <OrderEditModal
        editProduct={editProduct}
        setModalMode={setModalMode}
        modalMode={modalMode}
        getData={getOrderData}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        editOrderId={editOrderId}
      />

      {/* 舊context寫法，暫保留
      <ToastContext.Provider value={toastContextValue}>
        <ProductDetailModal
          ref={ProductDetailModalRef}
          modalBodyText="訊息"
          modalSize={{ width: "300px", height: "200px" }}
          modalImgSize={{ width: "300px", height: "120px" }}
        />
      </ToastContext.Provider> */}
    </>
  );
}
