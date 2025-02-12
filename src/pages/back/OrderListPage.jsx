import { useState,useCallback, useEffect } from 'react';
import { apiServiceAdmin } from "../../apiService/apiService";
import { Pagination } from "../../component/back";
const APIPath = import.meta.env.VITE_API_PATH;
export default function OrderListPage(){
  const [orderData, setOrderData] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

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
      console.log(resOrder);
      setOrderData(resOrder.data.orders);
      setPageInfo(resOrder.data.pagination);
    } catch (error) {
      console.log(error);
      // navigate('/login');
    } finally{
      // ProductDetailModalRef.current.close();
    }
  },[pageInfo]);
  useEffect(()=>{
    getOrderData();
  },[]);
  return(<>
    {orderData.length > 0 ? (
      <>
        <div className="row mt-1 mb-2 mx-1">
          <div>
            <h3>產品列表</h3>
            <table className="table">
              <thead>
                <tr>
                  <th className="col-1" >id</th>
                  <th className="col-1" >付款</th>
                  <th className="col-1" >金額</th>
                  {/* <th>類別</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th style={{ width: "10%" }}>啟用</th>
                  <th style={{ width: "20%" }}>功能</th>
                  <th>假的購買人數</th> */}
                </tr>
              </thead>
              <tbody>
                {
                  orderData.map((order)=>{
                    return (
                      <tr id={order.id} key={order.id}>
                        <th>{order.id}</th>
                        <td>
                          <span className={!order.is_paid ? "text-danger fw-bold fs-4" : ""}>
                            {order.is_paid ? "已付款" : "未付款"}
                          </span>
                        </td>
                        <td>{order.total}</td>
                      </tr>
                    );
                  })
                }
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
  
  </>);
}