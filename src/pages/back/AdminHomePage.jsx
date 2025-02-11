import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiServiceAdmin } from "../../apiService/apiService";
export default function AdminHomePage() {
  const navigate = useNavigate();
  const handleCheckLogin = async () => {
    try {
      await apiServiceAdmin.axiosPost("/api/user/check",{});
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  };
  useEffect(() => {
    handleCheckLogin();
  },[]);
  return (
    <div className="container text-center bg-primary text-white py-5 mt-5">
      <p className="display-4 fw-bold">這是沒有東西的後台首頁</p>
    </div>
  );
}
