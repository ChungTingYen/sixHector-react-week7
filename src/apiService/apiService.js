
import { userInstance,adminInstance } from "./apiConfig";

export const apiService = {
  axiosGet : async (path)=>{
    const response = await userInstance.get(path);
    return response;
  },
  axiosPost:async(path,postData)=>{
    const response = await userInstance.post(path,postData);
    return response;
  },
  // axiosGetCartData:async(path)=>{
  //   const response = await userInstance.get(path);
  //   return response;
  // },
  axiosDelete:async(path)=>{
    const response = await userInstance.delete(path);
    response;
  },
  axiosPut:async(path,putData)=>{
    const response = await userInstance.put(path,putData);
    return response;
  }
};

export const apiServiceAdmin = {
  axiosGet : async (path)=>{
    const response = await adminInstance.get(path);
    return response;
  },
  axiosPost:async(path,postData)=>{
    const response = await adminInstance.post(path,postData);
    return response;
  },
  axiosDelete:async(path)=>{
    const response = await adminInstance.delete(path);
    response;
  },
  axiosPut:async(path,putData)=>{
    const response = await adminInstance.put(path,putData);
    return response;
  },
  axiosGetProductData : async(path)=>{
    const response = await adminInstance.get(path);
    return response;
  },
  axiosGetProductDataByConfig : async(path,config)=>{
    const response = await adminInstance.get(path,  config ) || {};
    return response;
  },
  axiosPostSignin : async(path,account) =>{
    const response = await adminInstance.post(path, account);
    return response;
  },
  axiosPostCheckSingin : async(path) =>{
    const response = await adminInstance.post(path,{},);
    return response;
  },
  axiosPostAddProduct : async(path,productData) =>{
    const response = await adminInstance.post(path,productData);
    return response;
  },
  axiosDeleteProduct : async(path) =>{
    const response = await adminInstance.delete(path);
    return response;
  },
  axiosPostImg : async(path,putData,)=>{
    const response = await adminInstance.post(path,putData);
    return response;
  },
  axiosPutProduct : async(path,putData)=>{
    const response = await adminInstance.put(path,putData);
    return response;
  },
  axiosPostLogout : async(path) =>{
    const response = await adminInstance.post(path,{});
    return response;
  }
};
