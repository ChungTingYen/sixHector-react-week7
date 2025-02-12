import { useRef } from "react";

function ProductModal() {
  const OrderModalDivRef = useRef();
  return (
    <>
      <div
        id="productModal"
        className="modal fade"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        ref={OrderModalDivRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4"></h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                // onClick={closeEditModal}
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={modalproduct.title}
                      onChange={handleEditDataChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={modalproduct.category}
                      onChange={handleEditDataChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={modalproduct.unit}
                      onChange={handleEditDataChange}
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        min={0}
                        value={modalproduct.origin_price}
                        onChange={handleEditDataChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        min={0}
                        value={modalproduct.price}
                        onChange={handleEditDataChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      value={modalproduct.description}
                      onChange={handleEditDataChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      value={modalproduct.content}
                      onChange={handleEditDataChange}
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      checked={modalproduct.is_enabled}
                      onChange={handleEditDataChange}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                  <div className="row g-3 mb-3 mt-1">
                    <label htmlFor="buyerNumber">購買人數</label>
                    <input
                      name="buyerNumber"
                      id="buyerNumber"
                      type="number"
                      className="form-control"
                      placeholder="請輸入購買人數"
                      min={0}
                      value={modalproduct.buyerNumber}
                      onChange={handleEditDataChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-12 ">
                  <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">
                      主圖上傳
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleImgUpload}
                      ref={uploadRef}
                    />
                  </div>
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      value={modalproduct.imageUrl}
                      onChange={handleEditDataChange}
                    />
                  </div>
                  {modalproduct.imageUrl && (
                    <div style={{ width: "100%", height: "500px" }}>
                      <img
                        src={modalproduct.imageUrl}
                        alt={modalproduct.title}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </div>
                <hr />
                {modalproduct.imagesUrl.map((image, index) => (
                  <div key={index} className="col-md-6 mb-1">
                    <label
                      htmlFor={`imagesUrl-${index + 1}`}
                      className="form-label"
                    >
                      副圖 {index + 1}
                    </label>
                    <input
                      id={`imagesUrl-${index + 1}`}
                      type="text"
                      placeholder={`圖片網址 ${index + 1}`}
                      className="form-control mb-2"
                      value={image}
                      onChange={(e) => handleImgsUrlChange(e, index)}
                      name={`imagesUrl-${index + 1}`}
                    />
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onClick={(e) => handleImgToMaster(e, index)}
                        />
                      )}
                    </div>
                    {modalproduct.imagesUrl.length > 2 && <hr />}
                  </div>
                ))}
              </div>
            </div> */}
            {/* <div className="d-flex justify-content-end">
              <div className="btn-group w-100">
                {modalproduct.imagesUrl.length < 5 &&
                  modalproduct.imagesUrl[modalproduct.imagesUrl.length - 1] !==
                    "" && (
                    <button
                      className="btn btn-outline-primary btn-sm w-50"
                      onClick={(e) => handleAddImage(e.target.value)}
                    >
                      新增圖片
                    </button>
                  )}
                {modalproduct.imagesUrl.length > 1 && (
                  <button
                    className="btn btn-outline-danger btn-sm w-50"
                    onClick={(e) => handleRemoveImage(e.target.value)}
                  >
                    取消最後尾圖片
                  </button>
                )}
              </div>
            </div> 
            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                aria-label="Close"
                // onClick={closeEditModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                // onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
            */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductModal;
