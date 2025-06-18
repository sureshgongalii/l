import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pothole Detector</h1>
              <p className="text-xs text-gray-500">AI-Powered Road Analysis</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#upload" className="text-gray-600 hover:text-primary-600 transition-colors">
              Try Now
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;