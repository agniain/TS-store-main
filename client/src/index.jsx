import React from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import DeliveryAddress from './pages/address';
import Cart from './pages/cart';
import Detail from './pages/detail';
import Invoice from './pages/invoice';
import Order from './pages/order';
import CategoryAlbum from './pages/categoryAlbum';
import CategoryTshirt from './pages/categoryTshirt';
import CategoryHoodie from './pages/categoryHoodie';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/delivery-address",
    element: <DeliveryAddress />,
  },
  {
    path: "/carts",
    element: <Cart />
  },
  {
    path: "/products/:productId",
    element: <Detail />,
  },
  {
    path: "/invoices/:orderId",
    element: <Invoice />,
  },
  {
    path: "/orders",
    element: <Order />,
  },
  {
    path: "/categories/Album/products",
    element: <CategoryAlbum />,
  },
  {
    path: "/categories/T-shirt/products",
    element: <CategoryTshirt />,
  },
  {
    path: "/categories/Hoodie/products",
    element: <CategoryHoodie />,
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
