import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Globe, Camera, BarChart3 } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Detection',
      description: 'Computer vision model trained specifically for pothole identification with bounding box precision',
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant analysis with visual annotations showing exact pothole locations and confidence scores',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'High Precision',
      description: 'Advanced detection algorithms with confidence scoring for reliable road hazard identification',
      color: 'text-green-600'
    },
    {
      icon: Globe,
      title: 'Browser-Based',
      description: 'No installation required. Works directly in your web browser with client-side processing',
      color: 'text-blue-600'
    },
    {
      icon: Camera,
      title: 'Multiple Formats',
      description: 'Supports JPG, PNG, WebP and various image formats with intelligent preprocessing',
      color: 'text-pink-600'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive reports with detection coordinates, confidence scores, and safety recommendations',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advanced Detection Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our computer vision system provides precise pothole detection with visual annotations 
            and detailed analysis for road safety assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`p-3 rounded-lg w-fit mb-4 bg-gray-100`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-primary-600 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Analyze Your Roads?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Experience our advanced pothole detection system with real-time visual annotations 
              and comprehensive safety analysis.
            </p>
            <button 
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Detection
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;