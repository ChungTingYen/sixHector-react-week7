 
import { useRef,  useEffect,memo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import { useSelector } from "react-redux";
const FlashModal = ()=> {
  const flashModalSlice = useSelector((state) => {
    return state.flashModalAtStore.flashModalInfo;
  });
  useEffect(() => {
    if(modalDivRef1.current){
      new Modal(modalDivRef1.current, { backdrop: 'static' });
    }
  }, []);
  useEffect(()=>{
    flashModalSlice.isShowFlashModal ? openFlashModal() : closeFlashModal();
  },[flashModalSlice.isShowFlashModal]);

  const modalDivRef1 = useRef(null);
  const getMessage = (flashlModalText = null) => {
    switch (flashlModalText) {
    case "loading":
      return "進行中...";
    case "loadingData":
      return "載入資料中...";
    case "creating":
      return "建立中...";
    case "deleting":
      return "刪除中...";
    case "checking":
      return "檢查中...";
    case "closing":
      return "關閉中...";
    default:
      return ".........";
    }
  };

  const openFlashModal = ()=>{
    const modalInstance = Modal.getInstance(modalDivRef1.current);
    getMessage(flashModalSlice.text);
    modalInstance.show();
  };
  const closeFlashModal = () => {
    const modalInstance = Modal.getInstance(modalDivRef1.current);
    modalInstance.hide();
  };

  return (
    <>
      <div
        className="modal fade"
        id="myModal"
        ref={modalDivRef1}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ zIndex: 1099 }}
      >
        <div className="modal-dialog" style={{ width: "30%" }}>
          <div className="modal-content" style={{ height:'200px' }}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
               訊息
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body d-flex justify-content-center align-items-center"
              id="modalBody"
            >
              {getMessage(flashModalSlice.text)}
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeFlashModal}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(FlashModal);
