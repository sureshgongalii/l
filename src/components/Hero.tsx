import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Zap, Shield, Eye } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-100 opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Detect Potholes with
              <span className="text-gradient block">AI Precision</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced computer vision technology to identify road hazards instantly. 
              Upload your road images and get detailed analysis with precise pothole detection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button 
              onClick={scrollToUpload}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Try Detection Now</span>
            </button>
            <a 
              href="#features" 
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Eye className="h-5 w-5" />
              <span>View Features</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-primary-600 mx-auto mt-1" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">99% Accuracy</h3>
              <p className="text-gray-600 text-sm">State-of-the-art YOLO model trained on thousands of road images</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
                <Zap className="h-8 w-8 text-primary-600 mx-auto mt-1" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600 text-sm">Get pothole detection results in seconds with visual annotations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
                <Eye className="h-8 w-8 text-primary-600 mx-auto mt-1" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600 text-sm">Simple drag-and-drop interface for seamless user experience</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ArrowDown className="h-6 w-6 text-gray-400" />
      </motion.div>
    </section>
  );
};

export default Hero;