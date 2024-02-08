import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosGetUser, axiosGetWithToken, axiosPostWithToken } from "../axiosServices";
import Navbar from "../components/navbar";
import successGif from "../images/check.gif"

const Order = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('Cart Items:', cartItems);
    cartItems.products?.forEach((item, index) => {
      console.log(`Item ${index + 1} Products:`, item);
    });
  }, [cartItems]);

  useEffect(() => {
    console.log('user full name:', userData && userData.full_name);
  }, [userData]);

  useEffect(() => {
    console.log('Delivery Address:', deliveryAddress);
  }, [deliveryAddress]);

  const fetchData = async () => {
    try {
      const cartRes = await axiosGetWithToken("/carts");
      setCartItems(cartRes.data);

      const userRes = await axiosGetUser("/users");
      setUserData(userRes.data);

      const addressRes = await axiosGetWithToken("/delivery-address");
      if (addressRes.data && addressRes.data) {
        setDeliveryAddress(addressRes.data);
      } else {
        console.error("No delivery address found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  
  const placeOrder = async () => {
    try {
      const isAuthenticated = localStorage.getItem("token") !== null;
  
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }
  
      const orderPayload = {
        user: userData._id,
        cart_items: cartItems._id,
        delivery_address: deliveryAddress._id,
      };
  
      // save order
      const orderRes = await axiosPostWithToken("/orders", orderPayload);

      if (orderRes.data && orderRes.data.order && orderRes.data.order._id) {
         setOrderId(orderRes.data.order._id);
         setIsOrderPlaced(true);
      } else {
         throw new Error("Error placing order: Order ID not available in the response");
      }
      
   } catch (placeOrderError) {
      console.error("Error placing order:", placeOrderError.message);
   }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const handleInvoiceRedirect = () => {
    if (orderId) {
       navigate(`/invoices/${orderId}`);
    } else {
       console.error("No order Id found");
    }
 };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="max-w-xl mx-auto p-3 mt-4 border">
        {isAuthenticated ? (
          <>
            {!isOrderPlaced ? (
              <>
                <h2 className="text-3xl font-bold mb-4">Order Detail</h2>
                <div className="font-semibold">{userData && userData.full_name}</div>    
                <div>
                  <h3 className="mt-2">Alamat Pengiriman</h3>
                  <div className="mb-4">
                    {`${deliveryAddress.alamat}, ${deliveryAddress.kelurahan}, ${deliveryAddress.kecamatan}, ${deliveryAddress.kota}, ${deliveryAddress.provinsi}, ${deliveryAddress.detail}`}
                  </div>
                </div>   
                <div>
                  {cartItems && cartItems.products && cartItems.products.length > 0 && (
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
                            <div className="w-32 ml-2">
                              <p>{` ${formatCurrency(product.productId && product.productId.price)}`}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex mt-4">
                          <div className="w-80 font-semibold mr-2">Total Harga:</div>
                          <div> {formatCurrency(cartItems.sub_total)}</div> 
                      </div>
                      <div className="flex">
                          <div className="w-80 font-semibold mr-2">Ongkos Kirim:</div>
                          <div> {formatCurrency(cartItems.delivery_fee)}</div> 
                      </div>
                      <div className="flex">
                          <div className="w-80 font-semibold mr-2">Total Pesanan:</div>
                          <div> {formatCurrency(cartItems.total_order)}</div> 
                      </div>
                    </div>
                  )}
    
                  <button
                    className="mt-6 ml-40 bg-cyan-950 text-white py-2 px-4 rounded hover:bg-cyan-700"
                    onClick={placeOrder}
                  >
                    Buat Pesanan
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center">
                <p className="text-black text-xl font-bold">Pesanan berhasil!</p>
                <img
                  src={successGif}
                  alt="Success GIF"
                  className="mt-4"
                  style={{ maxWidth: "50%", height: "auto" }}
                />
                <div className="mt-4">
                  <button onClick={handleInvoiceRedirect} className="bg-cyan-950 text-white py-2 px-4 rounded hover:bg-cyan-700">
                    Lihat Invoice
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link to="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4">
            Kembali
          </Link>
        )}
        
      </div>
    </>
  );  
 
};

export default Order;
