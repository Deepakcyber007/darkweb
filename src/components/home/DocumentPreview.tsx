import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface DocumentPreviewProps {
  documents: string[];
  onClose: () => void;
}

function DocumentPreview({ documents, onClose }: DocumentPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0));
  };

  const currentDocument = documents[currentIndex];
  const isImage = currentDocument?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = currentDocument?.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg w-full max-w-4xl overflow-hidden border border-indigo-700/30">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-indigo-700/30">
          <h3 className="text-base sm:text-lg font-semibold text-indigo-200">
            Document {currentIndex + 1} of {documents.length}
          </h3>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={currentDocument}
              download
              className="text-indigo-400 hover:text-indigo-300 p-1 transition-colors"
              title="Download"
            >
              <Download size={20} />
            </a>
            <button
              onClick={onClose}
              className="text-indigo-400 hover:text-indigo-300 p-1 transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="h-[50vh] sm:h-[70vh] overflow-auto bg-black/50">
            {isImage ? (
              <img
                src={currentDocument}
                alt={`Document ${currentIndex + 1}`}
                className="max-w-full h-auto mx-auto"
              />
            ) : isPDF ? (
              <iframe
                src={`${currentDocument}#view=FitH`}
                className="w-full h-full"
                title={`Document ${currentIndex + 1}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-indigo-300">Preview not available</p>
              </div>
            )}
          </div>

          {documents.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-indigo-900/80 text-indigo-200 rounded-full p-1 sm:p-2 hover:bg-indigo-800/80 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-indigo-900/80 text-indigo-200 rounded-full p-1 sm:p-2 hover:bg-indigo-800/80 transition-colors backdrop-blur-sm"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {documents.length > 1 && (
          <div className="p-3 sm:p-4 border-t border-indigo-700/30">
            <div className="flex justify-center gap-2">
              {documents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-indigo-400' : 'bg-indigo-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentPreview;