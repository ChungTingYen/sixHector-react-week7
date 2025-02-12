import { useState, useCallback, useEffect } from "react";
import { apiServiceAdmin } from "../../apiService/apiService";
import { Pagination, Orders, OrderEditModal } from "../../component/back";
const APIPath = import.meta.env.VITE_API_PATH;
export default function OrderListPage() {
  const [orderData, setOrderData] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getOrderData = useCallback(async (page = 1) => {
    try {
      const resOrder = await apiServiceAdmin.axiosGetProductDataByConfig(
        `/api/${APIPath}/admin/orders`,
        {
          params: {
            page: page,
          },
        }
      );
      console.log(resOrder.data);
      setOrderData(resOrder.data.orders);
      setPageInfo(resOrder.data.pagination);
    } catch (error) {
      console.log(error);
      // navigate('/login');
    } finally {
      // ProductDetailModalRef.current.close();
    }
  }, []);

  const handleOpenOrderModalWithValue = useCallback(
    (mode, orderId = null) => {
      if (mode === "create") {
        // setEditProduct(tempProductDefaultValue);
        // setModalMode(mode);
      } else if (orderId && mode === "edit") {
        console.log("orderId=", orderId);
        setEditProduct(
          () => orderData.find((order) => order.id === orderId) ?? {}
        );
        setModalMode(mode);

        // const { imagesUrl = [], ...rest } =
        //   orderData.find((order) => order.id === orderId) ?? {};
        // const updatedProduct = {
        //   ...rest,
        //   imagesUrl: imagesUrl.filter(Boolean),
        // };
        //imagesUrl.filter(Boolean) 是用來過濾掉 imagesUrl 數組中所有虛值的簡潔語法
        // （如 null、undefined、0、false、NaN 或空字符串）。
        // setEditProduct(updatedProduct);
      }
      setIsModalOpen(true);
    },
    [orderData]
  );
  useEffect(() => {
    getOrderData();
  }, []);
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
                    <th className="col-1">id</th>
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
                      />
                    );
                  })}
                  {/* {orderData.map((order) => {
                    return (
                      <tr id={order.id} key={order.id}>
                        <th>{order.id}</th>
                        <td>
                          <span
                            className={
                              !order.is_paid ? "text-danger fw-bold fs-4" : ""
                            }
                          >
                            {order.is_paid ? "已付款" : "未付款"}
                          </span>
                        </td>
                        <td>{order.total}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-warning mx-1"
                            onClick={atOpenOrderMOdal}
                          >
                            詳細
                          </button>
                        </td>
                      </tr>
                    );
                  })} */}
                  {/* {filterData.map((product, index) => {
                  return (
                    <Products
                      key={product.id}
                      {...product}
                      index={index}
                      handleDeleteModal={handleDeleteModal}
                      handleOpenEditModalWithValue={
                        handleOpenEditModalWithValue
                      }
                    />
                  );
                })} */}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination getData={getOrderData} pageInfo={pageInfo} />
        </>
      ) : (
        <h1>沒有訂單或訂單載入中</h1>
      )}
      <OrderEditModal
        editProduct={editProduct}
        setModalMode={setModalMode}
        modalMode={modalMode}
        getData={getOrderData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
