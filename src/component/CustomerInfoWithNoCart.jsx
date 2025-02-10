import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
export default function CustomerInfoWithNoCart(){
  const navigate = useNavigate();
  function gotoProductsPage(){
    const timer = setTimeout(() => {
      navigate('/products');
    }, 3000);
    return timer;
  }
  useEffect(() => {
    const timer = gotoProductsPage();
    return () => clearTimeout(timer);
  }, []);
  
  return (<p>購物車無產品，3秒後跳轉到商品頁。</p>);
}