import React from 'react';
import { motion } from 'framer-motion';
import { Train, Shield, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Train className="h-8 w-8 text-blue-600" />,
      title: "Efficient Cleaning",
      description: "State-of-the-art cleaning management for railway systems"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Platform",
      description: "Advanced security measures to protect your data"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Team Management",
      description: "Easily manage and coordinate cleaning staff"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Real-time Tracking",
      description: "Monitor cleaning progress in real-time"
    }
  ];

  return (
    <div className="min-h-screen">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 text-center"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Railway Cleaning Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your railway cleaning operations with our advanced management system
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;