import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { axiosGet } from "../axiosServices";

const CategoryHoodie = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosGet("/categories/Hoodie/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };


    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="cursor-pointer p-2 md:p-4 border rounded-md transition-all duration-300 hover:shadow-md"
          >
            <img
              src={`http://localhost:3001/images/products/${product.image_url}`}
              alt={product.name}
              className="mb-2 rounded-md"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">Rp {product.price}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="text-blue-500 hover:underline ml-2">
        Kembali
      </Link>
    </div>
  );
};

export default CategoryHoodie;
