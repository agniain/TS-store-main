import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, } from "react-router-dom";
import { axiosGetWithToken } from "../axiosServices";
import Navbar from "../components/navbar";

const formatDate = (isoTimestamp) => {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const date = new Date(isoTimestamp);
  const day = date.toLocaleString("id-ID", { weekday: "long" });
  const month = date.toLocaleString("id-ID", { month: "long" });
  const formattedDate = `${date.getDate()} ${month} ${date.getFullYear()} (${date.getHours()}.${date.getMinutes()})`;

  return formattedDate;
};

const Invoice = () => {
  const { orderId } = useParams();
  const [invoiceData, setInvoiceData] = useState({});
  const isAuthenticated = localStorage.getItem("token") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axiosGetWithToken(`/invoices/${orderId}`);
        setInvoiceData(response.data.data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoiceData();
  }, [orderId]);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    navigate("/login");
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }; 

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="max-w-2xl mx-auto mt-7 mb-7 p-4 border border-gray-300"> 
        <h2 className="text-2xl font-bold mb-1">Invoice</h2>
        <p className="font-semibold mb-3">(Invoice Id: {orderId})</p>
        <div>
          <h3 className="font-semibold">Nama:</h3>
          <p>{invoiceData.user}</p>
        </div>
        <div>
          <h3 className="mt-3 font-semibold">Alamat:</h3>
          <p>
            {invoiceData.delivery_address &&
              `${invoiceData.delivery_address.alamat}, 
              Kel. ${invoiceData.delivery_address.kelurahan}, 
              Kec. ${invoiceData.delivery_address.kecamatan}, 
              Kota ${invoiceData.delivery_address.kota}, 
              ${invoiceData.delivery_address.provinsi}, 
              ${invoiceData.delivery_address.detail}`}
          </p>
        </div>
        <div>
          <div className="mt-3 font-semibold">Order Detail:</div>
          {invoiceData.order_details &&
            invoiceData.order_details.map((orderDetail, index) => (
              <div key={index} className="mb-4">
                {orderDetail.products.map((product, idx) => (
                  <div key={idx}>
                    <div className="flex">
                      <div className="w-60">{product.name}</div>
                      <div className="w-20"> x {product.quantity}</div> 
                      <div className="w-40"> {formatCurrency(product.price)}</div>
                    </div>
                  </div>
                ))}
                <div className="flex mt-4">
                    <div className="w-80 font-semibold">Ongkos Kirim:</div>
                    <div> {formatCurrency(orderDetail.delivery_fee)}</div> 
                </div>
                <div className="flex">
                    <div className="w-80 font-semibold">Total Order:</div>
                    <div> {formatCurrency(orderDetail.total_order)}</div> 
                </div>
              </div>
            ))}
        </div>
        <div className="flex">
            <div className="w-80 font-semibold">Tanggal pemesanan:</div>
            <div> {formatDate(invoiceData.created_at)}</div> 
        </div>     
      </div>
      <Link to="/" className="bg-cyan-950 text-white mx-80 px-5 py-2 rounded hover:bg-cyan-700 mt-10">
          Kembali
      </Link>
    </>
  );
};

export default Invoice;
