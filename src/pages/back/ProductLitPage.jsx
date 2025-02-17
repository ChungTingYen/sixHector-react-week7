import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiServiceAdmin } from "../../apiService/apiService";
import { ToastContext } from "../../component/back/ToastContext";
import {
  Products,
  ProductEditModal,
  ProductDeleteModal,
  Pagination,
  AppFunction,
} from "../../component/back";
import { ProductDetailModal,Toast } from "../../component/common";
import * as utils from "../../utils/utils";
import { tempProductDefaultValue } from "../../data/defaultValue";
import { toastInfo } from "../../data/dataModel";
import { productDataAtLocal } from "../../data/productDataAtLocal";
import { useDebounce } from "@uidotdev/usehooks";
const APIPath = import.meta.env.VITE_API_PATH;
export default function ProductListsPage() {
  const navigate = useNavigate();
  const [isLoging, setIsLogin] = useState(false);
  const [productData, setProductData] = useState([]);
  const [editProduct, setEditProduct] = useState(tempProductDefaultValue);
  const [pageInfo, setPageInfo] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceAscending, setPriceAscending] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] =
    useState(false);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [productDetailModalType, setProductDetailModalType] = useState("");
  const [isShowToast, setIsShowToast] = useState(false);
  const ProductDetailModalRef = useRef(null);
  const debouncedSearchTerm = useDebounce(category, 1000);
  const toastContextValue = {
    setIsShowToast,
    isShowToast,
    setProductDetailModalType,
    productDetailModalType,
  };
  const filterData = useMemo(() => {
    return (
      [...productData]
        .filter((item) => item.title.match(search))
        // .sort((a, b) => a.title.localeCompare(b.title))
        .sort((a, b) => priceAscending && a.price - b.price)
    );
  }, [productData, search, priceAscending]);
  useEffect(() => {
    handleCheckLogin();
  }, []);
  useEffect(() => {
    if (isLoging) {
      debouncedSearchTerm
        ? getCategoryProducts(debouncedSearchTerm)
        : handleGetProducts();
    }
  }, [debouncedSearchTerm, isLoging]);
  const handleCheckLogin = async () => {
    setProductDetailModalType("checking");
    utils.modalStatus(ProductDetailModalRef, "", null, false);
    try {
      await apiServiceAdmin.axiosPost("/api/user/check", {});
      setIsLogin(true);
    } catch (error) {
      console.log(error);
      navigate("/login");
    } finally {
      ProductDetailModalRef.current.close();
    }
  };
  const handleGetProducts = async () => {
    try {
      utils.modalStatus(ProductDetailModalRef, "", null, false);
      await getProductData();
    } catch (error) {
      console.log(error);
    } finally {
      ProductDetailModalRef.current.close();
    }
  };
  const getProductData = useCallback(
    async (page = 1) => {
      try {
        const resProduct = await apiServiceAdmin.axiosGetProductDataByConfig(
          `/api/${APIPath}/admin/products`,
          {
            params: {
              page: page,
              category: pageInfo.category,
            },
          }
        );
        setProductData(resProduct.data.products);
        setPageInfo(resProduct.data.pagination);
      } catch (error) {
        console.log(error);
        navigate("/login");
      } finally {
        // ProductDetailModalRef.current.close();
      }
    },
    [navigate, pageInfo]
  );
  const handleDeleteModal = useCallback(
    (productId) => {
      const updatedProduct =
        productData.find((product) => product.id === productId) ?? {};
      setEditProduct(updatedProduct);
      setIsProductDeleteModalOpen(true);
    },
    [productData]
  );
  const handleOpenEditModalWithValue = useCallback(
    (mode, productId = null) => {
      if (mode === "create") {
        setEditProduct(tempProductDefaultValue);
        setModalMode(mode);
      } else if (productId && mode === "edit") {
        const { imagesUrl = [], ...rest } =
          productData.find((product) => product.id === productId) ?? {};
        const updatedProduct = {
          ...rest,
          imagesUrl: imagesUrl.filter(Boolean),
        };
        //imagesUrl.filter(Boolean) 是用來過濾掉 imagesUrl 數組中所有虛值的簡潔語法
        // （如 null、undefined、0、false、NaN 或空字符串）。
        setEditProduct(updatedProduct);
        setModalMode(mode);
      }
      setIsProductEditModalOpen(true);
    },
    [productData]
  );
  //上傳內建資料隨機一項產品
  const handleAddProduct = async () => {
    setProductDetailModalType("creating");
    utils.modalStatus(ProductDetailModalRef, "", null, false);
    const productIndex = parseInt(Date.now()) % productDataAtLocal.length;
    const temp = { ...productDataAtLocal[productIndex], buyerNumber: 100 };
    const wrapData = {
      data: temp,
    };
    try {
      const resProduct = await apiServiceAdmin.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData
      );
      resProduct.data.success && getProductData();
      setIsShowToast(true);
      toastInfo.type = "success";
      toastInfo.toastText = "成功上傳!";
    } catch (error) {
      console.log(error);
    } finally {
      ProductDetailModalRef.current.close();
    }
  };
  //上傳全部內建資料產品
  const handleAddAllProducts = async () => {
    setProductDetailModalType("loading");
    utils.modalStatus(ProductDetailModalRef, "", null, false);
    const results = await utils.AddProductsSequentially(productDataAtLocal);
    setEditProduct(tempProductDefaultValue);
    if (!results.length) {
      setIsShowToast(true);
      toastInfo.type = "success";
      toastInfo.toastText = "成功上傳!";
      getProductData();
    } else alert(results.join(","));
    ProductDetailModalRef.current.close();
  };
  //刪除第一頁全部產品
  const handleDeleteAllProducts = async () => {
    setProductDetailModalType("deleting");
    utils.modalStatus(ProductDetailModalRef, "", null, false);
    if (productData.length > 0) {
      const results = await utils.deleteProductsSequentially(productData);
      setEditProduct(tempProductDefaultValue);
      if (!results.length) {
        setIsShowToast(true);
        toastInfo.type = "danger";
        toastInfo.toastText = "刪除完成!";
        getProductData();
      } else alert(results.join(","));
    }
    ProductDetailModalRef.current.close();
  };

  const handleSearchCategory = (e) => {
    setCategory(e.target.value);
  };
  const getCategoryProducts = async (query) => {
    setProductDetailModalType("loadingData");
    utils.modalStatus(ProductDetailModalRef, "", null, false);
    try {
      const resProduct = await apiServiceAdmin.axiosGetProductDataByConfig(
        `/api/${APIPath}/admin/products`,
        {
          params: {
            category: query,
          },
        }
      );
      setProductData(resProduct.data.products);
    } catch (error) {
      console.log("error:", error);
    }
    ProductDetailModalRef.current.close();
  };
  return (
    <>
      <AppFunction setIsLogin={setIsLogin} />
      <div className="row mt-1 mb-2 mx-1">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center mb-2">
            <h3>產品功能</h3>
            <button
              type="button"
              className="btn btn-warning mx-1"
              onClick={handleGetProducts}
            >
              更新產品清單
            </button>
            <button
              type="button"
              className="btn btn-info mx-1"
              onClick={handleAddAllProducts}
            >
              上傳全部內建資料產品
            </button>
            <button
              type="button"
              className="btn btn-info mx-1"
              onClick={handleAddProduct}
            >
              上傳內建資料隨機一項產品
            </button>
            <button
              type="button"
              className="btn btn-danger mx-1"
              onClick={handleDeleteAllProducts}
            >
              刪除第一頁全部產品
            </button>
          </div>
          <div className="d-flex align-items-center mb-2">
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={() => handleOpenEditModalWithValue("create")}
            >
              建立新的產品
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center mt-2">
          <div className="">
            測試功能:搜尋此頁商品名稱:
            <input
              type="search"
              style={{ width: "100px" }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
            />
            <button
              type="button"
              className="btn btn-secondary mx-1"
              onClick={() => setSearch("")}
            >
              清除
            </button>
          </div>
          <div className="me-2 mx-1">
            價格排序:
            <input
              type="checkbox"
              checked={priceAscending}
              onChange={(e) => setPriceAscending(e.target.checked)}
              className="mx-1 form-check-input"
            />
          </div>
          <div className="me-2 mx-1 ms-5">
            測試功能:Desbounce for category:
            <input
              type="search"
              style={{ width: "200px" }}
              className="mx-1"
              onChange={handleSearchCategory}
              value={category}
            />
            <button
              type="button"
              className="btn btn-secondary mx-1"
              onClick={(e) => handleSearchCategory(e)}
            >
              清除
            </button>
          </div>
        </div>
      </div>
      {productData.length > 0 ? (
        <>
          <div className="row mt-1 mb-2 mx-1">
            <div>
              <h3>產品列表</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>index</th>
                    <th style={{ width: "20%" }}>產品名稱</th>
                    <th>類別</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th style={{ width: "10%" }}>啟用</th>
                    <th style={{ width: "20%" }}>功能</th>
                    <th>假的購買人數</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData.map((product, index) => {
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination getData={getProductData} pageInfo={pageInfo} />
        </>
      ) : (
        <h1>沒有商品或商品載入中</h1>
      )}

      <ToastContext.Provider value={toastContextValue}>
        <ProductDetailModal
          ref={ProductDetailModalRef}
          modalBodyText="訊息"
          modalSize={{ width: "300px", height: "200px" }}
          modalImgSize={{ width: "300px", height: "120px" }}
          // productDetailModalType={productDetailModalType}
        />
        <ProductEditModal
          editProduct={editProduct}
          setModalMode={setModalMode}
          modalMode={modalMode}
          getProductData={getProductData}
          isProductEditModalOpen={isProductEditModalOpen}
          setIsProductEditModalOpen={setIsProductEditModalOpen}
        />
        <ProductDeleteModal
          setModalMode={setModalMode}
          modalMode={modalMode}
          getProductData={getProductData}
          isProductDeleteModalOpen={isProductDeleteModalOpen}
          setIsProductDeleteModalOpen={setIsProductDeleteModalOpen}
          editProduct={editProduct}
        />
        <Toast
          toastText={toastInfo.toastText}
          type={toastInfo.type}
          isShowToast={isShowToast}
          setIsShowToast={setIsShowToast}
        />
      </ToastContext.Provider>
    </>
  );
}
