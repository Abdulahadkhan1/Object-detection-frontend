import React, { useRef, useState, useCallback } from 'react';
import { Upload, Camera, FileImage, CheckCircle, XCircle, Loader, Zap, Download, X } from 'lucide-react';

const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const openCamera = () => {
    fileInputRef.current.setAttribute('capture', 'environment');
    fileInputRef.current.click();
  };

  const openGallery = () => {
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('http://0.0.0.0:8001/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetApp = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  // Helper to get full image URL
  const getImageUrl = (url) => url?.startsWith('http') ? url : `http://0.0.0.0:8001${url}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Object Detection
          </h1>
          <p className="text-gray-600 text-lg">Upload an image and let AI analyze it for you</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-blue-600" />
              Upload Image
            </h2>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleCapture}
              className="hidden"
            />

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer bg-gray-50 hover:bg-blue-50"
              onClick={openGallery}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetApp();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">Drop your image here</p>
                  <p className="text-gray-400">or click to browse</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={openCamera}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </button>
              <button
                onClick={openGallery}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Gallery
              </button>
            </div>

            {/* Upload Button */}
            {image && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze Image
                  </>
                )}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white/80 rounded-3xl shadow-2xl p-8 border border-blue-100 flex flex-col gap-8 min-h-[32rem]">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" /> Results
            </h2>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center">
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  <div>
                    <h3 className="font-semibold text-red-800">Error</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {result && (
              <div className="flex flex-col gap-6 w-full">
                {result.processing_success && result.predictions ? (
                  <div className="w-full">
                    <h3 className="font-semibold text-gray-800 mb-3">AI Predictions:</h3>
                    <div className="space-y-3">
                      {result.predictions.map((prediction, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-2 ${
                            index === 0
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 capitalize">
                              {prediction.class}
                            </span>
                            <div className="flex items-center">
                              <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm">
                                {prediction.confidence}%
                              </div>
                              {index === 0 && (
                                <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                              )}
                            </div>
                          </div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                index === 0
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${prediction.confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800">
                      {result.processing_error || 'Processing completed but no predictions available'}
                    </p>
                  </div>
                )}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800">Upload Successful</h3>
                    <p className="text-green-600 text-sm">File: {result.filename}</p>
                  </div>
                </div>
              </div>
            )}
            {result && result.output_image_url && (
              <div className="mt-8 flex flex-col items-center w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Detected Objects</h3>
                <div className="relative group cursor-pointer w-full flex flex-col items-center">
                  <img
                    src={getImageUrl(result.output_image_url)}
                    alt="Detected objects with bounding boxes"
                    className="rounded-xl shadow-lg border-2 border-blue-200 max-w-full max-h-80 transition-transform group-hover:scale-105 bg-blue-50"
                    style={{ objectFit: 'contain', background: '#f8fafc' }}
                    onClick={() => setModalOpen(true)}
                  />
                  <a
                    href={getImageUrl(result.output_image_url)}
                    download
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-2 shadow-lg flex items-center opacity-90 hover:opacity-100 transition-opacity"
                    onClick={e => e.stopPropagation()}
                  >
                    <Download className="w-5 h-5 mr-1" /> Download
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-2">Click image to enlarge</p>
              </div>
            )}
            {/* Modal for full-size image */}
            {modalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-3xl w-full flex flex-col items-center">
                  <button
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                    onClick={() => setModalOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img
                    src={getImageUrl(result.output_image_url)}
                    alt="Detected objects full size"
                    className="rounded-xl max-h-[70vh] w-auto object-contain border-2 border-blue-200 shadow-lg"
                  />
                  <a
                    href={getImageUrl(result.output_image_url)}
                    download
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Image
                  </a>
                </div>
              </div>
            )}
            {!result && !error && !uploading && (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <FileImage className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Upload an image to see AI predictions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;