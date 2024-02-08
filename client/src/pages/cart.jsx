import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosGetWithToken } from "../axiosServices";
import Navbar from "../components/navbar";

const Cart = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const getCartItems = useCallback(async () => {
    try {
      const res = await axiosGetWithToken('/carts');
      console.log('Cart Items Response:', res.data);
      setCartItems(res.data);
    } catch (err) {
      console.log('Error fetching cart items:', err);
    }
  }, []);
  
  useEffect(() => {
    getCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCartItems]);
  
  useEffect(() => {
    console.log('Cart Items:', cartItems);
  
    if (cartItems && cartItems.products) {
      cartItems.products.forEach((item, index) => {
        console.log(`Item ${index + 1} Products:`, item);
      });
    }
  }, [cartItems]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const handleCheckOut = () => {
    navigate('/orders');
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
{isAuthenticated ? (
  <div className="mt-5 max-w-xl mx-auto p-4 border flex flex-col items-center justify-center">
    <h2 className="text-3xl font-bold mb-8">Keranjang Belanja</h2>
    {cartItems && cartItems.products && cartItems.products.length > 0 ? (
      <div className="flex flex-col">
        {cartItems.products.map((product, index) => (
          <div key={product.productId._id} className="flex items-center mb-4">
            <img
              src={`http://localhost:3001/images/products/${product.productId.image_url}`}
              alt={product.productId && product.productId.name}
              className="h-12 w-auto mr-2 flex-shrink-0"
            />
            <div className="ml-2 flex">
              <div className="w-40">
                <p>{product.productId && product.productId.name}</p>
              </div>
              <div className="w-24">
                <p>{`x ${product.quantity}`}</p>
              </div>
              <div className="w-32">
                <p>{` ${formatCurrency(product.productId && product.productId.price)}`}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 mb-10">
          <p className="font-bold">Total: {formatCurrency(cartItems.sub_total)}</p>
        </div>
        <div className="flex justify-between items-center">
          <button className="bg-cyan-950 text-white py-2 px-9 rounded hover:bg-cyan-700" onClick={handleCheckOut}>
            Checkout
          </button>
          <Link to="/" className="bg-cyan-950 text-white py-2 px-10 rounded hover:bg-cyan-700 mr-6">
            Kembali
          </Link>
        </div>
      </div>
    ) : (
      <>
        <p className="mb-5">Keranjang anda kosong.</p>
        <Link to="/" className="bg-cyan-950 text-white py-2 px-4 mt-5 rounded hover:bg-cyan-700">
          Kembali
        </Link>
      </>
    )}
  </div>
) : null}

    </>
  );
};
  

export default Cart;