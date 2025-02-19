import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiServiceAdmin } from "../../apiService/apiService";
import {
  Products,
  ProductEditModal,
  ProductDeleteModal,
  Pagination,
  AppFunction,
} from "../../component/back";
import * as utils from "../../utils/utils";
//舊context寫法，暫保留
// import { ToastContext } from "../../component/back/ToastContext";
// import { ProductDetailModal } from "../../component/common";
import { tempProductDefaultValue } from "../../data/defaultValue";
import { productDataAtLocal } from "../../data/productDataAtLocal";
import { useDebounce } from "@uidotdev/usehooks";
const APIPath = import.meta.env.VITE_API_PATH;
import { useFlashModal,useToast } from '../../hook';

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
 
  const debouncedSearchTerm = useDebounce(category, 1000);
  //舊context寫法，暫保留
  // const ProductDetailModalRef = useRef(null);
  // const [productDetailModalType, setProductDetailModalType] = useState("");
  // const toastContextValue = {
  //   setProductDetailModalType,
  //   productDetailModalType,
  // };
  const updateFlashModal = useFlashModal();
  const updateToast = useToast();
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
    updateFlashModal('checking',true);
    try {
      await apiServiceAdmin.axiosPost("/api/user/check", {});
      setIsLogin(true);
    } catch (error) {
      console.log(error);
      navigate("/login");
    } finally {
      updateFlashModal('closing',false);
    }
  };
  const handleGetProducts = async (type = null) => {
    try {
      if(type)
        updateFlashModal("loadingData",true);
      await getProductData();
    } catch (error) {
      console.log(error);
    } finally {
      if(type)
        updateFlashModal("closing",false);
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
    updateFlashModal("creating",true);
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
      updateToast("成功上傳!","success",true);
    } catch (error) {
      console.log(error);
    } finally {
      updateFlashModal("closing",false);
    }
  };
  //上傳全部內建資料產品
  const handleAddAllProducts = async () => {
    updateFlashModal("loading",true);
    const results = await utils.AddProductsSequentially(productDataAtLocal);
    setEditProduct(tempProductDefaultValue);
    if (!results.length) {
      updateToast("成功上傳!","success",true);
      getProductData();
    } else alert(results.join(","));
    updateFlashModal("closing",false);
  };
  //刪除第一頁全部產品
  const handleDeleteAllProducts = async () => {
    //舊context寫法，暫保留
    // setProductDetailModalType("deleting");
    // utils.modalStatus(ProductDetailModalRef, "", null, false);
    updateFlashModal("deleting",true);
    if (productData.length > 0) {
      const results = await utils.deleteProductsSequentially(productData);
      setEditProduct(tempProductDefaultValue);
      if (!results.length) {
        updateToast("刪除完成!","danger",true);
        getProductData();
      } else alert(results.join(","));
    }
    //舊context寫法，暫保留
    // ProductDetailModalRef.current.close();
    updateFlashModal("closing",false);
  };

  const handleSearchCategory = (e) => {
    setCategory(e.target.value);
  };
  const getCategoryProducts = async (query) => {
    updateFlashModal("loadingData",true);
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
    updateFlashModal("closing",false);
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
              onClick={()=>handleGetProducts('check')}
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
      {/*舊context寫法，暫保留
      <ToastContext.Provider value={toastContextValue}>
         <ProductDetailModal
          ref={ProductDetailModalRef}
          modalBodyText="訊息"
          modalSize={{ width: "300px", height: "200px" }}
          modalImgSize={{ width: "300px", height: "120px" }}
        /> 
      </ToastContext.Provider>*/}
    </>
  );
}
