import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

import { useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register']; // Add other routes if needed

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;
