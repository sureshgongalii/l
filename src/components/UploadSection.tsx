import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, AlertTriangle, CheckCircle, X, Download } from 'lucide-react';

interface DetectionResult {
  image: string;
  detections: number;
  confidence: number;
}

const UploadSection: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const simulateDetection = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock result with the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      const mockResult: DetectionResult = {
        image: e.target?.result as string,
        detections: Math.floor(Math.random() * 5) + 1,
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      };
      setResult(mockResult);
      setIsProcessing(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="upload" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Road Image
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Drop an image of a road or street to detect potholes using our advanced AI model
          </p>
        </motion.div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {!selectedFile && !result && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your image here
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-400">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </motion.div>
            )}

            {selectedFile && !result && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Image className="h-6 w-6 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={simulateDetection}
                    disabled={isProcessing}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5" />
                        <span>Detect Potholes</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetUpload}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Detection Complete</h3>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img
                      src={result.image}
                      alt="Detection result"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Detection Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Potholes Found:</span>
                          <span className="font-semibold text-danger-600">{result.detections}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-semibold text-green-600">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-semibold ${result.detections > 0 ? 'text-danger-600' : 'text-green-600'}`}>
                            {result.detections > 0 ? 'Hazards Detected' : 'Road Clear'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {result.detections > 0 && (
                      <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-danger-600" />
                          <h5 className="font-semibold text-danger-800">Safety Alert</h5>
                        </div>
                        <p className="text-danger-700 text-sm">
                          {result.detections} pothole{result.detections > 1 ? 's' : ''} detected. 
                          Exercise caution when driving on this road.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="btn-primary flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Download Report</span>
                  </button>
                  <button
                    onClick={resetUpload}
                    className="btn-secondary"
                  >
                    Analyze Another Image
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;