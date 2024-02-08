import React from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cyan-950 p-4 mt-8 w-full">
        <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white">
            About Us
        </Link>

        <p className="text-white"><LocationOnIcon /> Bandung, Indonesia</p>
        <div className="flex items-center">
            <a href="https://instagram.com" className="text-white mx-2">
            <InstagramIcon />
            </a>
            <a href="https://wa.me/123456789" className="text-white">
            <WhatsAppIcon />
            </a>
        </div>
        </div>
    </footer>
  )
}

export default Footer;