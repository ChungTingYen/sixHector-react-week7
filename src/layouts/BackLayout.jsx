import { NavLink, Outlet } from "react-router-dom";

const routes = [
  { path: "/admin", name: "後台首頁" },
  { path: "/admin/productList", name: "產品後台列表" },
  { path: "/admin/orderList", name: "訂單列表" },
  { path: "/", name: "前台首頁" },
];

export default function FrontLayout() {
  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => (
              <li key={route.path} className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to={route.path}
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
