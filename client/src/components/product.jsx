import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosGet } from "../axiosServices";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axiosGet("/products", {
          page: currentPage,
          limit: 12,
        });
    
        setProducts(productsResponse.data.data);
        setTotalPages(Math.ceil(productsResponse.data.count / 12));
    
        const tagsResponse = await axiosGet("/tags");
        setTags(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [currentPage]); 

  const handleTagClick = async (tagId) => {
    try {
      const response = await axiosGet(`/tags/${tagId}/products`);
      setSelectedTag(response.data);
    } catch (error) {
      console.error("Error fetching products by tag:", error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // filter
  const filteredProducts = selectedTag
  ? selectedTag 
  : products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePreviousClick = () => {
      setCurrentPage((prev) => {
        const newPage = Math.max(prev - 1, 1);
        console.log('Handling Previous Click. New Page:', newPage);
        return newPage;
      });
    };
    
    const handleNextClick = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    useEffect(() => {
      console.log('Current Page Changed:', currentPage);
      console.log('Total Pages Changed:', totalPages);
    }, [currentPage, totalPages]);
  
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
    }; 

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl ml-5 mb-4">A place for all swifties.</h1>
      <input
        type="text"
        placeholder="Cari Produk..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 ml-5"
      />
      <div className="flex space-x-4 mb-4 ml-5">
        <p className="text-2xl">Tags: </p>
        {tags.map((tag) => (
          <button
            key={tag._id}
            onClick={() => handleTagClick(tag._id)}
            className={`px-4 py-2 text-black rounded-md ${
              selectedTag === tag._id ? "bg-blue-200" : "bg-gray-200"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="cursor-pointer p-2 md:p-4 border rounded-md transition-all duration-300 hover:shadow-md hover:opacity-60"
          >
            <img
              src={`http://localhost:3001/images/products/${product.image_url}`}
              alt={product.name}
              className="mb-2 h-60 rounded-md object-cover mx-auto"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">{formatCurrency(product.price)}</p>
            <p className="text-gray-700">Stok: {product.stock}</p>

          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center items-center">
        <button 
          onClick={handlePreviousClick}
          disabled={currentPage === 1} 
          className="bg-cyan-950 text-white px-4 py-2 rounded-md mr-2"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextClick} disabled={currentPage === totalPages} className="bg-cyan-950 text-white px-4 py-2 rounded-md mr-2">
          Next
        </button>
      </div>
    </div>
  );
};

export default Product;
