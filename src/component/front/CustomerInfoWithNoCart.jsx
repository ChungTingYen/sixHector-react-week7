import { useNavigate } from "react-router-dom";
import { useEffect,useState } from 'react';
export default function CustomerInfoWithNoCart(){
  const navigate = useNavigate();
  const [time,setTime] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev === 0) {
          clearInterval(interval);
          navigate("/products");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);
  return (<p>購物車無產品，{time}秒後跳轉到商品頁。</p>);
}