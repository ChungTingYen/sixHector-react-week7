import { useRef, useEffect } from "react";
import { Toast } from "bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setIsShowToastSlice } from "../../slice/toastSlice";
const { VITE_TOAST_SHOWTIME } = import.meta.env;
import { toastSliceDefaultValue } from "../../data/defaultValue";
const ToastComponent = () => {
  const toastDivRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if (toastDivRef.current) {
      new Toast(toastDivRef.current, {
        autohide: true,
        delay: parseInt(VITE_TOAST_SHOWTIME), // x秒後自動關閉
      });
      toastDivRef.current.addEventListener("hidden.bs.toast", () => {
        dispatch(setIsShowToastSlice(toastSliceDefaultValue));
      });
    }
  }, []);
  const toastSlice = useSelector((state) => {
    return state.toastAtStore.toastInfo;
  });

  useEffect(() => {
    if (toastSlice.isShowToast) {
      showToast();
    }
  }, [toastSlice.isShowToast]);

  const showToast = () => {
    const toastInstance = Toast.getInstance(toastDivRef.current);
    toastInstance.show();
  };
  const closeToast = () => {
    const toastInstance = Toast.getInstance(toastDivRef.current);
    toastInstance.hide();
  };
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <div
        className={`toast text-bg-${toastSlice.type}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref={toastDivRef}
      >
        <div className="toast-body d-flex">
          <strong className="me-auto">{toastSlice.text}</strong>
          <button
            type="button"
            className="btn-close ms-auto flex-shrink-0"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastComponent;
