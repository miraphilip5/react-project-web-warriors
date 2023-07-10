import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Logout from "./pages/Logout";
import Flowers from "./pages/Flowers";
import FlowerDetail from "./pages/FlowerDetail"

const isLoggedIn = !!localStorage.getItem("token");
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: isLoggedIn? <Flowers /> : <Login /> },
      { path: "register", element: <Register /> },
      { path: "flowers", element: <Flowers /> },
      { path: "flower/:f_id", element: <FlowerDetail /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "orders", element: <Orders /> },
      { path: "cart", element: <Cart /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);