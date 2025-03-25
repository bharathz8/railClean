import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Train,  LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login"); // Redirect to login
  };

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Train className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">RailClean</span>
          </Link>

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
               {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link to="/login" className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors">
                  Login
                </Link>

                {/* Register Button */}
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
