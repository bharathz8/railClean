import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Train } from "lucide-react";
import { motion } from "framer-motion";
//import trainLogo from "../assets/train.png"; // ✅ Adjust path based on your folder structure

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Fallback icon when image is not available */}
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Train className="h-6 w-6 text-white" />
              </div>
              {/* Uncomment when you have the image */}
              {/*
              <img
                src={trainLogo}
                alt="RailClean Logo"
                className="h-10 w-10 object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              */}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                RailClean
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Task Management System
              </span>
            </div>
          </Link>

          {/* Enhanced Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20"></div>
    </motion.nav>
  );
};

export default Navbar;