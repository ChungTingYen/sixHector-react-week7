import { useEffect, useState } from "react";
import { apiService } from "../apiService/apiService";
import { Product, LoadingOverlay, ProductModal, Toast } from "../component";
import { toastInfo } from "../data/dataModel";
import { tempProductDefaultValue } from "../data/data";
const APIPath = import.meta.env.VITE_API_PATH;
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(tempProductDefaultValue);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [reload, setReload] = useState(true);
  const [isShowToast, setIsShowToast] = useState(false);

  const openProductDetailModal = () => {
    setIsProductModalOpen(true);
  };
  const handleSeeMore = (productId) => {
    const temp = products.find((item) => item.id === productId);
    setTempProduct(temp);
    openProductDetailModal();
  };
  const setToastContent = (toastText, type) => {
    setIsShowToast(true);
    toastInfo.toastText = toastText;
    toastInfo.type = type;
  };
  const getProducts = async () => {
    setIsLoading(true);
    try {
      const {
        data: { products, pagination, success, message },
      } = await apiService.axiosGet(`/api/${APIPath}/products`);
      setProducts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // if (reload) {
    getProducts();
    // getCart();
    // setReload(false);
    // }
  }, []);
  return (
    <>
      <div className="container">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Product
                key={product.id}
                handleSeeMore={handleSeeMore}
                product={product}
                setIsLoading={setIsLoading}
                setToastContent={setToastContent}
              ></Product>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <LoadingOverlay />}
      {/* Modal */}
      <ProductModal
        tempProduct={tempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
        setIsLoading={setIsLoading}
        setToastContent={setToastContent}
      />
      <Toast
        toastText={toastInfo.toastText}
        type={toastInfo.type}
        isShowToast={isShowToast}
        setIsShowToast={setIsShowToast}
      />
    </>
  );
}
