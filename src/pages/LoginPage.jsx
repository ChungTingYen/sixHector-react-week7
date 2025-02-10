import { useState, } from "react";
import { useNavigate } from "react-router-dom";
// import { useLogin } from "../component/LoginContext";
import { apiService } from "../apiService/apiService";
import { sweetalert } from "../utils/utils";
const LoginPage = () => {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const changeInput = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };
  //登入
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.axiosPost("/admin/signin", account);
      if (res.data.success) {
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        // alert(res.data.message);
        sweetalert(res.data.message, "", "success", "確認");
        navigate('/admin/productsList');
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   const handleCheckLogin = async () => {
  //     try {
  //       const result = await apiServiceAdmin.axiosPost("/api/user/check",{});
  //       //   setIsLogin(true);
  //       navigate('/admin/productsList');
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     handleCheckLogin();
  //   },[]);
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              placeholder="name@example.com"
              name="username"
              onChange={changeInput}
              value={account.username}
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="password"
              onChange={changeInput}
              value={account.password}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary" type="submit">
            登入
          </button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
};

export default LoginPage;
