import React from "react";
import { motion } from "framer-motion";
import { Train, Shield, Users, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Train className="h-10 w-10" />,
      title: "Efficient Cleaning",
      description: "State-of-the-art cleaning management for railway systems",
      gradient: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Secure Platform",
      description: "Advanced security measures to protect your data",
      gradient: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Team Management",
      description: "Easily manage and coordinate cleaning staff",
      gradient: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Real-time Tracking",
      description: "Monitor cleaning progress in real-time",
      gradient: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 px-4 overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-4 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50 mb-8"
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-slate-700 font-medium">Welcome to the Future of Railway Cleaning</span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">
              Railway Cleaning
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your railway cleaning operations with our{" "}
            <span className="font-semibold text-blue-700">advanced management system</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-3 px-8 py-4 font-bold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="group inline-flex items-center gap-3 px-8 py-4 font-bold text-blue-700 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Login</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:w-6 group-hover:h-6 group-hover:bg-blue-600 transition-all duration-300"></div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium">Core Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed to make railway cleaning management effortless and efficient
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative z-10 w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4">
            Ready to Transform Your Operations?
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of railway operators who trust our platform for efficient cleaning management
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your Journey
              <Sparkles className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
