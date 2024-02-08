import { useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { axiosGet, axiosPostWithToken } from "../axiosServices";
import Navbar from '../components/navbar';

const Detail = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const navigate = useNavigate();
  const { productId } = useParams();
  const [prodById, setProdById] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  const getProductById = useCallback(async () => {
    try {
      const res = await axiosGet(`/products/${productId}`);
      setProdById(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [productId]);

  useEffect(() => {
    getProductById();
  }, [getProductById]);

  const addToCart = async () => {
    try {
      if (!isAuthenticated) {
        console.log("User is not authenticated. Redirecting to login page...");
        return;
      }

      const cartItem = {
        productId: prodById._id,
        quantity: quantity,
      };

      console.log('Adding to cart:', prodById._id, quantity);
      console.log('CartItem:', cartItem);

      const response = await axiosPostWithToken("/carts", { products: [cartItem] });

      if (response.data && response.data.cart) {
        setAddToCartSuccess(true);
      } else {
        console.error("Error adding to cart:", response.data && response.data.message);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(Math.max(0, quantity - 1));
  };

  useEffect(() => {
    setAddToCartSuccess(false);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }; 

  const handleNavigateToCart = () => {
    console.log("handleNavigateToCart is called.");
    navigate('/carts');
  };

  return (
    <>
  <Navbar isAuthenticated={isAuthenticated} />
  <div className="w-1/3 h-screen mx-auto p-2 border">
    <h1 className="text-4xl mb-3 text-center">Detail Produk</h1>
    {addToCartSuccess && (
      <div className="bg-green-200 text-green-800 p-2 mb-4">
        Berhasil ditambahkan ke keranjang!
      </div>
    )}
    <div key={prodById._id} className="flex flex-col items-center">
      <img
        className="mb-4 rounded h-72 object-cover"
        src={`http://localhost:3001/images/products/${prodById.image_url}`}
        alt={prodById.name}
      />
      <div className="text-left w-full max-w-xl">
        <div className="mr-5 flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold">{prodById.name}</h2>
          <p className="text-xl">{`${formatCurrency(prodById.price)}`}</p>
        </div>
        <p className="text-gray-700">{`Deskripsi: ${prodById.description}`}</p>
        <p className="text-gray-700">{`Kategori: ${prodById.category ? prodById.category.name : 'N/A'}`}</p>
        <p className="text-gray-700 mb-4">{`Tags: ${prodById.tags ? prodById.tags.map(tag => tag.name).join(', ') : 'N/A'}`}</p>
      </div>
    </div>
    <div className="flex items-center justify-center mb-2">
      <button
        className="bg-cyan-950 text-white py-1 px-2 rounded hover:bg-cyan-700"
        onClick={decreaseQuantity}
      >
        -
      </button>
      <input
        className="p-1 border text-center"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
      />
      <button
        className="bg-cyan-950 text-white py-1 px-2 rounded hover:bg-cyan-700"
        onClick={increaseQuantity}
      >
        +
      </button>
    </div>
    <div className="flex justify-center">
      <button
        className="bg-cyan-950 text-white py-1 px-2 rounded hover:bg-cyan-700"
        onClick={addToCart}
      >
        + Keranjang
      </button>
      <button
        className="bg-cyan-950 text-white ml-2 py-1 px-2 rounded hover:bg-cyan-700"
        onClick={() => handleNavigateToCart()} 
      >
        Lihat keranjang
      </button>
    </div>
  </div>
</>
  );
};

export default Detail;
