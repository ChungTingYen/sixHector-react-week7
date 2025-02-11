import { Link } from "react-router-dom";
export default function NotFoundPage(){
  return (
    <>
      <div className="container text-center bg-success text-white py-5 mt-5">
        <p className="display-4 fw-bold">Oops! 這個網頁不存在</p>
      
      </div>
      <div className="container text-center text-white py-5 mt-5">
        <Link to='/' className="display-5 fw-bold">回到首頁</Link>
      </div>
      <div className="container text-center text-white py-5 mt-5">
        <Link to='/login' className="display-5 fw-bold">回到Login</Link>
      </div>
    </>
  );
  
}