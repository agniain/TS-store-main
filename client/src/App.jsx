import {Route, Routes} from "react-router-dom";
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import DeliveryAddress from "./pages/address";
import Cart from './pages/cart';
import Detail from './pages/detail';
import Invoice from './pages/invoice'
import Order from "./pages/order";
import CategoryAlbum from "./pages/categoryAlbum";
import CategoryTshirt from "./pages/categoryTshirt";
import CategoryHoodie from "./pages/categoryHoodie";

const App = () => {
  return (
    <>
    <div>
        <Routes>
          <Route path="/" exact children={() => <Home />} />
          <Route path="/register" element={() => <Register />} />
          <Route path="/login" element={() => <Login />} />
          <Route path="/delivery-address" element={() => <DeliveryAddress />} />
          <Route path="/carts" element={() => <Cart />} />
          <Route path="/products/:productId" element={() => <Detail />} />
          <Route path="/invoices/:orderId" element={() => <Invoice />} />
          <Route path="/orders" element={() => <Order />} />
          <Route path="/categories/Album/products" element={() => <CategoryAlbum />} />
          <Route path="/categories/T-shirt/products" element={() => <CategoryTshirt />} />
          <Route path="/categories/Hoodie/products" element={() => <CategoryHoodie />} />
        </Routes>
    </div>
    </>
  )
}

export default App;
