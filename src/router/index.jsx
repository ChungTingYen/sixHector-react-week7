import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import BackLayout from "../layouts/BackLayout";
import {
  HomePage,ProductsPage,ProductDetailPage,
  NotFoundPage,CartPage,CustomerInfoPage,
  LoginPage ,ProductListsPage 
} from "../pages";

const routes = [
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      {
        path: "products/:id",
        element: <ProductDetailPage />
      },
      { path:'cart',element:<CartPage/> },
      { path:'customerInfo',element:<CustomerInfoPage/> },
      { path:'login',element:<LoginPage/> , }
    ]
  },
  {
    path:'admin',
    element:<BackLayout/>,
    children:[{ path:'productsList',element:<ProductListsPage/> },]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

const router = createHashRouter(routes);

export default router;
