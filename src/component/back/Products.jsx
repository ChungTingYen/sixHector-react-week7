/* eslint-disable react/prop-types */
import React, { memo } from "react";
// import Modal from "./Modal";

const Product = (props) => {
  const {
    index,
    id,
    title,
    origin_price,
    price,
    is_enabled,
    category,
    isSelected,
    handleOpenEditModalWithValue,
    handleDeleteModal,
    buyerNumber
  } = props;
  const atOpenEditMOdal = () => {
    handleOpenEditModalWithValue("edit", id);
  };
  const atOpenDeleteModal = () => {
    handleDeleteModal(id);
  };
  return (
    <>
      {
        <tr className={isSelected ? "table-info" : ""} id={id}>
          <th scope="row">{index} </th>
          <th scope="row">{title}</th>
          <th>{category}</th>
          {/* <td>{title}</td> */}
          <td>{origin_price}</td>
          <td>{price}</td>
          <td>
            <span className={!is_enabled ? "text-danger fw-bold fs-4" : ""}>
              {is_enabled ? "啟用" : "未啟用"}
            </span>
          </td>
          <td>
            <div className="d-flex justify-content-end btn-group">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={atOpenEditMOdal}
              >
                編輯
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={atOpenDeleteModal}
              >
                刪除
              </button>
            </div>
          </td>
          <td>{buyerNumber}</td>
        </tr>
      }
    </>
  );
};

export default memo(Product);
