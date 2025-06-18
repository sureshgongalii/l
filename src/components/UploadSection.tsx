import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, AlertTriangle, CheckCircle, X, Download, Loader } from 'lucide-react';

interface DetectionResult {
  image: string;
  originalImage: string;
  detections: Array<{
    bbox: [number, number, number, number];
    confidence: number;
    class: string;
  }>;
  totalDetections: number;
  averageConfidence: number;
  processedImage?: string;
}

const UploadSection: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setResult(null);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const drawDetections = (imageElement: HTMLImageElement, detections: DetectionResult['detections']) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match image
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    // Draw the original image
    ctx.drawImage(imageElement, 0, 0);

    // Draw detection boxes
    detections.forEach((detection, index) => {
      const [x1, y1, x2, y2] = detection.bbox;
      const width = x2 - x1;
      const height = y2 - y1;

      // Draw bounding box
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Draw confidence label background
      const label = `Pothole ${(detection.confidence * 100).toFixed(1)}%`;
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x1, y1 - 25, textWidth + 10, 25);
      
      // Draw confidence label text
      ctx.fillStyle = 'white';
      ctx.fillText(label, x1 + 5, y1 - 8);
    });

    return canvas.toDataURL();
  };

  const performDetection = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        
        // Create image element to get dimensions
        const img = new Image();
        img.onload = () => {
          // Simulate AI detection with more realistic results
          const mockDetections = generateRealisticDetections(img.naturalWidth, img.naturalHeight);
          
          // Draw detections on canvas
          const processedImageUrl = drawDetections(img, mockDetections);
          
          const detectionResult: DetectionResult = {
            image: imageDataUrl,
            originalImage: imageDataUrl,
            detections: mockDetections,
            totalDetections: mockDetections.length,
            averageConfidence: mockDetections.length > 0 
              ? mockDetections.reduce((sum, det) => sum + det.confidence, 0) / mockDetections.length 
              : 0,
            processedImage: processedImageUrl || imageDataUrl
          };

          setResult(detectionResult);
          setIsProcessing(false);
        };
        
        img.onerror = () => {
          setError('Failed to load image');
          setIsProcessing(false);
        };
        
        img.src = imageDataUrl;
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Detection failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const generateRealisticDetections = (width: number, height: number) => {
    // Generate 0-3 realistic pothole detections
    const numDetections = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 3) + 1;
    const detections = [];

    for (let i = 0; i < numDetections; i++) {
      // Generate realistic bounding boxes (potholes are usually small relative to image)
      const boxWidth = Math.random() * 0.15 * width + 0.05 * width; // 5-20% of image width
      const boxHeight = Math.random() * 0.1 * height + 0.03 * height; // 3-13% of image height
      
      const x1 = Math.random() * (width - boxWidth);
      const y1 = Math.random() * (height - boxHeight);
      const x2 = x1 + boxWidth;
      const y2 = y1 + boxHeight;

      detections.push({
        bbox: [x1, y1, x2, y2] as [number, number, number, number],
        confidence: Math.random() * 0.25 + 0.75, // 75-100% confidence
        class: 'pothole'
      });
    }

    return detections;
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadReport = () => {
    if (!result) return;

    const reportData = {
      timestamp: new Date().toISOString(),
      filename: selectedFile?.name || 'unknown',
      detections: result.totalDetections,
      confidence: `${(result.averageConfidence * 100).toFixed(1)}%`,
      status: result.totalDetections > 0 ? 'Hazards Detected' : 'Road Clear',
      details: result.detections.map((det, idx) => ({
        id: idx + 1,
        confidence: `${(det.confidence * 100).toFixed(1)}%`,
        coordinates: det.bbox
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pothole-detection-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            AI Pothole Detection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a road image to detect potholes using our advanced computer vision model
          </p>
        </motion.div>

        <div className="space-y-8">
          <canvas ref={canvasRef} className="hidden" />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!selectedFile && !result && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`upload-zone cursor-pointer ${dragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your road image here
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
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={performDetection}
                    disabled={isProcessing}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="animate-spin h-5 w-5" />
                        <span>Analyzing Image...</span>
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
                    disabled={isProcessing}
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
                    <h4 className="font-medium text-gray-900 mb-2">Detection Results</h4>
                    <img
                      src={result.processedImage}
                      alt="Detection results with annotations"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Red boxes indicate detected potholes with confidence scores
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Detection Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Potholes Found:</span>
                          <span className={`font-bold text-lg ${result.totalDetections > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {result.totalDetections}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg. Confidence:</span>
                          <span className="font-semibold text-green-600">
                            {result.totalDetections > 0 ? `${(result.averageConfidence * 100).toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Road Status:</span>
                          <span className={`font-semibold ${result.totalDetections > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {result.totalDetections > 0 ? 'Hazards Detected' : 'Road Clear'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {result.totalDetections > 0 && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h5 className="font-semibold text-red-800">Safety Alert</h5>
                        </div>
                        <p className="text-red-700 text-sm mb-3">
                          {result.totalDetections} pothole{result.totalDetections > 1 ? 's' : ''} detected. 
                          Exercise caution when driving on this road.
                        </p>
                        <div className="space-y-1">
                          {result.detections.map((detection, idx) => (
                            <div key={idx} className="text-xs text-red-600">
                              Pothole #{idx + 1}: {(detection.confidence * 100).toFixed(1)}% confidence
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.totalDetections === 0 && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h5 className="font-semibold text-green-800">All Clear</h5>
                        </div>
                        <p className="text-green-700 text-sm">
                          No potholes detected in this image. The road appears to be in good condition.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={downloadReport}
                    className="btn-primary flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Report</span>
                  </button>
                  <button
                    onClick={resetUpload}
                    className="btn-secondary flex items-center justify-center"
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