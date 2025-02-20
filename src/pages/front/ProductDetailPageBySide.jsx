import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../../apiService/apiService";
import { Modal } from "../../component/common";
const APIPath = import.meta.env.VITE_API_PATH;
export default function ProductDetailPageBySide() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const modalRef = useRef(null);
  const handleImageClick = (imageSrc) => {
    modalRef.current.setModalImage(imageSrc);
    modalRef.current.open();
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.axiosGet(`/api/${APIPath}/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);
  return (
    <>
      {Object.keys(product).length > 0 && (
        <div className="container mt-2 border border-0 border-start border-secondary border-2">
          {/* <p className="fw-bold">商品細節</p> */}
          <div className="card mb-3" style={{ border: "none" }}>
            <img
              src={product.imageUrl}
              className="card-img-top primary-image"
              alt="主圖"
              style={{
                cursor: "pointer",
                width: "90%",
                height: "100%",
                objectFit: "cover",
              }}
              onClick={() => handleImageClick(product.imageUrl)}
            />
            <div className="card-body">
              <h5 className="card-title">
                {product.title}
                <span className="badge bg-primary ms-2">
                  {product.category}
                </span>
              </h5>
              <p className="card-text">商品描述：{product.description}</p>
              <p className="card-text">商品內容：{product.content}</p>
              <div className="d-flex">
                <p className="card-text text-secondary">
                  <del>{product.origin_price}</del>元 / {product.price} 元
                </p>
              </div>
              <h5 className="mt-3">更多圖片：</h5>
              <div className="d-flex flex-wrap">
                {/* {JSON.stringify(product.imagesUrl,null,2)} */}
                {product.imagesUrl
                  .filter((item) => item != "")
                  .map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      className="card-img-top primary-image me-2 mb-1"
                      alt={`更多圖片${index}`}
                      style={{
                        width: "250px",
                        height: "250px",
                        objectFit: "cover",
                        cursor: "pointer", // 這裡設置光標為手指圖樣
                      }}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        ref={modalRef}
        modalBodyText="商品放大圖"
        modalSize={{ width: "600px", height: "800px" }}
        modalImgSize={{ width: "600px", height: "600px" }}
      />
    </>
  );
}
