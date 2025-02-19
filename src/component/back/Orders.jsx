/* eslint-disable react/prop-types */
import { memo } from "react";
const Orders = (props) => {
  const { index, id, total, is_paid, handleOpenOrderModalWithValue,handleDeleteModal } = props;
  const atOpenOrderMOdal = () => {
    handleOpenOrderModalWithValue("view", id);
  };
  const atOpenOrderDeleteMOdal = () => {
    handleDeleteModal(id);
  };
  const atOpenOrderEditMOdal = ()=>{
    handleOpenOrderModalWithValue('edit',id);
  };
  return (
    <>
      <tr>
        <th scope="row">{index} </th>
        <th scope="row">{id}</th>
        <td>
          <span className={!is_paid ? "text-danger fw-bold fs-4" : ""}>
            {is_paid ? "已付款" : "未付款"}
          </span>
        </td>
        <td>{total}</td>
        <td>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-warning mx-1"
              onClick={atOpenOrderMOdal}
            >
            詳細
            </button>
            <button
              type="button"
              className="btn btn-danger mx-1"
              onClick={atOpenOrderDeleteMOdal}
            >
            刪除
            </button>
            <button
              type="button"
              className="btn btn-danger mx-1"
              onClick={atOpenOrderEditMOdal}
            >
            編輯
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default memo(Orders);
