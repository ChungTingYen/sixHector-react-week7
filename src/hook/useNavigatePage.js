import { useNavigate } from "react-router-dom";

function useNavigatePage(){
  const navigate = useNavigate();
  const gotoPage = (path = '/')=>{
    navigate(path);
  };
  return gotoPage;
}

export default useNavigatePage ;