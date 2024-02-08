import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPostWithToken } from '../axiosServices';

const DeliveryAddress = () => {
  const [alamat, setAlamat] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [detail, setDetail] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const navigate = useNavigate();

  const handleDeliveryAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPostWithToken('/delivery-address', {
        alamat,
        kelurahan,
        kecamatan,
        kota,
        provinsi,
        detail,
      });

      console.log('Full response:', response);

      if (response && response.data) {
        console.log('Delivery address created successfully:', response.data);
        setAddressSuccess(true);
      } else {
        console.error('Error during delivery address creation: No response data');
      }
    } catch (error) {
      console.error(
        'Error during delivery address creation:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className='w-full flex items-center justify-center h-screen'>
      <div className='w-1/2 p-4 border'>
        {addressSuccess ? (
          <>
            <div className="border border-gray-600 mt-5 py-4">
              <div className="text-black mb-4">
                Alamat berhasil tersimpan!
              </div>
              <div className="mt-4">
                <button onClick={handleHomeRedirect} className='bg-cyan-950 px-6 py-2 text-white rounded hover:bg-cyan-900'>
                  Kembali
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='p-4'>
              <h1 className='text-xl mb-4 font-bold text-center'>Alamat Pengiriman</h1>
              <form onSubmit={handleDeliveryAddressSubmit} className="p-6 flex flex-col">
                <div className="mb-4 flex">
                  <label htmlFor="alamat" className="w-1/3 mr-2 text-left">Alamat:</label>
                  <input type="text" id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} className="border rounded-md p-2 w-2/3" required />
                </div>
                <div className="mb-4 flex">
                  <label htmlFor="kelurahan" className="w-1/3 mr-2 text-left">Kelurahan:</label>
                  <input type="text" id="kelurahan" value={kelurahan} onChange={(e) => setKelurahan(e.target.value)} className="border rounded-md p-2 w-2/3" required />
                </div>
                <div className="mb-4 flex">
                  <label htmlFor="kecamatan" className="w-1/3 mr-2 text-left">Kecamatan:</label>
                  <input type="text" id="kecamatan" value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} className="border rounded-md p-2 w-2/3" required />
                </div>
                <div className="mb-4 flex">
                  <label htmlFor="kota" className="w-1/3 mr-2 text-left">Kota:</label>
                  <input type="text" id="kota" value={kota} onChange={(e) => setKota(e.target.value)} className="border rounded-md p-2 w-2/3" required />
                </div>
                <div className="mb-4 flex">
                  <label htmlFor="provinsi" className="w-1/3 mr-2 text-left">Provinsi:</label>
                  <input type="text" id="provinsi" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} className="border rounded-md p-2 w-2/3" required />
                </div>
                <div className="mb-4 flex">
                  <label htmlFor="detail" className="w-1/3 mr-2 text-left">Detail Alamat:</label>
                  <input type="text" id="detail" value={detail} onChange={(e) => setDetail(e.target.value)} className="border rounded-md p-2 w-2/3" required />
                </div>
                <button type="submit" className="cursor-pointer bg-cyan-950 py-3 px-3 rounded text-white">Simpan Alamat</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  ); 
};

export default DeliveryAddress;
