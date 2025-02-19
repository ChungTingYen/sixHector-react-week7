export const tempProductDefaultValue = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: 0,
  price: 0,
  description: "",
  content: "",
  is_enabled: false,
  imagesUrl: [""],
  buyerNumber:0
};

export const pendingProductInfoDefaluValue = {
  id:null,
  type:null
};

export const orderDefaultValue =
  {
    data: {
      create_at: "",
      is_paid: 0,
      message: "",
      products: {},
      user: {
        name: "",
        tel: "",
        email: "",
        address: "",
      },
      num: "",
    },
  };

export const toastSliceDefaultValue = {
  toastInfo:
  {
    text: '',
    type: '',
    isShowToast: false,
  }
};
