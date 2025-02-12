/* eslint-disable react/prop-types */
import { memo } from "react";
// import Modal from "./Modal";

const Orders = (props) => {
  const { index, id, total, is_paid, handleOpenOrderModalWithValue } = props;
  const atOpenOrderMOdal = () => {
    handleOpenOrderModalWithValue("edit", id);
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
          <button
            type="button"
            className="btn btn-warning mx-1"
            onClick={atOpenOrderMOdal}
          >
            詳細
          </button>
        </td>
      </tr>
    </>
  );
};

export default memo(Orders);
