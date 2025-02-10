import axios from "axios";

const userBaseUrl = `${import.meta.env.VITE_BASE_URL}/v2`;
const adminBaseUrl = `${import.meta.env.VITE_BASE_URL}/v2`;

export const userInstance =  axios.create({ baseURL:userBaseUrl });

userInstance.interceptors.request.use((config)=>{
  return config;
});

userInstance.interceptors.response.use(
  (response)=>response,
  (error)=>{
    const errors = 
    error.response?.data.message 
      ? `狀態: ${error.status}, ${error.response.data.message}` 
      : error;
    //
    // alert(errors);
    return Promise.reject(errors);
  }
);

export const adminInstance = axios.create({
  baseURL: adminBaseUrl,
});

adminInstance.interceptors.request.use(
  (config) => {
    const token =  document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1] ?? '';
    const headers = {
      Authorization: token,
    };
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data, status } = error.response;
      const { message } = data;
      const errorMessage = message.message ? message.message : message;
      message !== '請重新登入' && alert(`adminInstance.interceptors: ${status}: ${errorMessage}`);
    } else {
      alert('adminInstance.interceptors: ', error);
    }
    return Promise.reject(error);
  }
);

