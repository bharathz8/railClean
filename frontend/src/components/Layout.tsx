import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register']; // Add other routes if needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar with conditional rendering */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      {/* Main content area */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 ${
          hideNavbarRoutes.includes(location.pathname) 
            ? 'container mx-auto px-6 py-12' 
            : 'container mx-auto px-6 py-8'
        }`}
      >
        {/* Content wrapper with subtle styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Outlet />
        </motion.div>
      </motion.main>

      {/* Optional: Subtle footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 pointer-events-none" />
    </div>
  );
};

export default Layout;


