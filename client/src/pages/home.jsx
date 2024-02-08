import React from 'react';

import Navbar from '../components/navbar';
import Product from '../components/product';
import Footer from '../components/footer';

const Home = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <Product />
      <Footer />
    </>
  );
};

export default Home;