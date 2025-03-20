import React, { useState } from 'react';
import { AlertCircle, Shield, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { SearchResult as SearchResultType } from '../../types/home';

interface SearchResultProps {
  result: SearchResultType;
  onRemovalRequest: () => void;
  getSeverityColor: (severity: string) => string;
}

function SearchResult({ result, onRemovalRequest, getSeverityColor }: SearchResultProps) {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const handlePrevDoc = () => {
    if (!result.data?.breach_documents) return;
    setCurrentDocIndex((prev) => 
      prev > 0 ? prev - 1 : result.data!.breach_documents!.length - 1
    );
  };

  const handleNextDoc = () => {
    if (!result.data?.breach_documents) return;
    setCurrentDocIndex((prev) => 
      prev < result.data!.breach_documents!.length - 1 ? prev + 1 : 0
    );
  };

  if (!result.found) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg overflow-hidden border-l-4 border-green-500 backdrop-blur-sm">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Shield className="text-green-400 shrink-0" size={24} />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-green-400 mb-1">
                Good news! Your information was not found in our database.
              </h2>
              <p className="text-indigo-200">
                We recommend regularly checking back and maintaining strong security practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data } = result;
  if (!data) return null;

  const currentDocument = data.breach_documents?.[currentDocIndex];
  const isImage = currentDocument?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = currentDocument?.match(/\.pdf$/i);

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg overflow-hidden border-l-4 border-red-500 backdrop-blur-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {data.profile_picture ? (
            <img
              src={data.profile_picture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-red-500/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 ring-2 ring-red-500/30">
              <span className="text-red-300 text-xl">
                {data.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <AlertCircle className="text-red-400 mb-2" size={24} />
            <h2 className="text-xl sm:text-2xl font-semibold text-red-400">
              Your information was found in a data breach
            </h2>
          </div>
        </div>

        <div className="bg-indigo-900/30 rounded-lg p-4 sm:p-6 mb-6 border border-indigo-700/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Personal Information</h4>
                <ul className="space-y-2 text-white">
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-indigo-300">Name:</span>
                    <span className="break-all text-indigo-100">{data.name}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-indigo-300">Email:</span>
                    <span className="break-all text-indigo-100">{data.email}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-indigo-300">Phone:</span>
                    <span className="text-indigo-100">{data.phone}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Breach Information</h4>
                <ul className="space-y-2 text-white">
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-indigo-300">Date:</span>
                    <span className="text-indigo-100">{data.breach_date}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-indigo-300">Source:</span>
                    <span className="break-all text-indigo-100">{data.breach_source}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-indigo-300">Severity:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      getSeverityColor(data.severity)
                    }`}>
                      {data.severity.toUpperCase()}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-2">Compromised Data</h4>
                <div className="flex flex-wrap gap-2">
                  {data.compromised_data.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-800/50 text-indigo-200 rounded-full text-sm border border-indigo-700/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {data.breach_documents && data.breach_documents.length > 0 && (
              <div className="bg-black/20 rounded-lg p-4 border border-indigo-700/30">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-indigo-300">Related Documents</h4>
                  {currentDocument && (
                    <a
                      href={currentDocument}
                      download
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      title="Download"
                    >
                      <Download size={20} />
                    </a>
                  )}
                </div>

                <div className="relative">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/30">
                    {isImage ? (
                      <img
                        src={currentDocument}
                        alt={`Document ${currentDocIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : isPDF ? (
                      <iframe
                        src={`${currentDocument}#view=FitH`}
                        className="w-full h-full"
                        title={`Document ${currentDocIndex + 1}`}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-indigo-300">Preview not available</p>
                      </div>
                    )}
                  </div>

                  {data.breach_documents.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevDoc}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-indigo-900/80 text-indigo-200 rounded-full p-2 hover:bg-indigo-800/80 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextDoc}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-900/80 text-indigo-200 rounded-full p-2 hover:bg-indigo-800/80 transition-colors backdrop-blur-sm"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {data.breach_documents.length > 1 && (
                  <div className="mt-4">
                    <div className="flex justify-center gap-2">
                      {data.breach_documents.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentDocIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentDocIndex ? 'bg-indigo-400' : 'bg-indigo-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-900/30 rounded-lg p-4 sm:p-6 border border-red-700/30">
          <h3 className="font-semibold text-red-200 text-lg mb-4">What should you do?</h3>
          <ul className="space-y-3 mb-6 text-red-200">
            <li className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>Change your passwords immediately, especially for accounts using the compromised email.</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>Enable two-factor authentication on all your accounts.</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>Monitor your accounts for suspicious activity.</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1">•</div>
              <div>Request removal of your data from the dark web using the button below.</div>
            </li>
          </ul>
          
          <button
            onClick={onRemovalRequest}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 flex items-center justify-center gap-2 transition-colors"
          >
            <Shield size={20} />
            Request Data Removal
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;