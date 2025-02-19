import { useEffect, useState,useCallback } from "react";
import { Outlet } from "react-router-dom";
import { apiService } from "../../apiService/apiService";
import { Product, LoadingOverlay, ProductModal } from "../../component/front";
import { tempProductDefaultValue } from "../../data/data";
const APIPath = import.meta.env.VITE_API_PATH;
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(tempProductDefaultValue);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openProductDetailModal = () => {
    setIsProductModalOpen(true);
  };
  const handleSeeMore = useCallback((productId) => {
    const temp = products.find((item) => item.id === productId);
    setTempProduct(temp);
    openProductDetailModal();
  },[products]);
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
    getProducts();
  }, []);
  return (
    <>
      <div className="container ">
        <div className="row">
          <div className="col-8">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>價格</th>
                  {/* <th>功能</th> */}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <Product
                    key={product.id}
                    handleSeeMore={handleSeeMore}
                    product={product}
                    setIsLoading={setIsLoading}
                  ></Product>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-4">
            <Outlet/>
          </div>
        </div>
      </div>
      {isLoading && <LoadingOverlay />}
      {/* Modal */}
      <ProductModal
        tempProduct={tempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
      />
    </>
  );
}
