// import { useEffect, useState } from "react";
// import { useNavigatePage } from "../../hook";
export default function CustomerInfoWithNoCart() {
  // const navigate = useNavigatePage();
  // const [time,setTime] = useState(5);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(prev => {
  //       if (prev === 0) {
  //         clearInterval(interval);
  //         navigate("/products");
  //         return prev;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [navigate]);
  // return (<p>購物車無產品，{time}秒後跳轉到商品頁。</p>);
  return (
    <div className="my-2">
      <p className="" style={{ color: "red" }}>
        <strong>購物車無產品</strong>
      </p>
    </div>
  );
}
