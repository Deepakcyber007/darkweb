import React, { useState } from 'react';
import { X, Save, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DataEntry } from '../../types/admin';

interface UserDetailModalProps {
  entry: DataEntry;
  onClose: () => void;
  onSave: (updatedEntry: DataEntry) => void;
  onDelete: (id: string) => void;
  getSeverityColor: (severity: string) => string;
}

function UserDetailModal({ entry, onClose, onSave, onDelete, getSeverityColor }: UserDetailModalProps) {
  const [editedEntry, setEditedEntry] = useState<DataEntry>(entry);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editedEntry);
    setIsEditing(false);
  };

  const handleChange = (field: keyof DataEntry, value: any) => {
    setEditedEntry(prev => ({ ...prev, [field]: value }));
  };

  const currentDocument = entry.breach_documents?.[currentDocIndex];
  const isImage = currentDocument?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = currentDocument?.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg w-full max-w-4xl overflow-hidden border border-indigo-700/30">
        <div className="flex justify-between items-center p-6 border-b border-indigo-700/30">
          <div className="flex items-center gap-4">
            {entry.profile_picture ? (
              <img
                src={entry.profile_picture}
                alt={entry.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-800/50 flex items-center justify-center ring-2 ring-indigo-500/30">
                <span className="text-2xl text-indigo-300">{entry.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-indigo-200">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedEntry.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-indigo-800/50 border border-indigo-600/50 rounded px-2 py-1 text-indigo-100"
                  />
                ) : (
                  entry.name
                )}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(entry.severity)}`}>
                  {entry.severity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <Save size={20} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-700 text-indigo-200 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-indigo-300 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedEntry.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full bg-indigo-800/50 border border-indigo-600/50 rounded px-3 py-2 text-indigo-100"
                      />
                    ) : (
                      <p className="text-indigo-100">{entry.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-300 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedEntry.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full bg-indigo-800/50 border border-indigo-600/50 rounded px-3 py-2 text-indigo-100"
                      />
                    ) : (
                      <p className="text-indigo-100">{entry.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-4">Breach Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-indigo-300 mb-1">Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedEntry.breach_date}
                        onChange={(e) => handleChange('breach_date', e.target.value)}
                        className="w-full bg-indigo-800/50 border border-indigo-600/50 rounded px-3 py-2 text-indigo-100"
                      />
                    ) : (
                      <p className="text-indigo-100">{entry.breach_date}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-300 mb-1">Source</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEntry.breach_source}
                        onChange={(e) => handleChange('breach_source', e.target.value)}
                        className="w-full bg-indigo-800/50 border border-indigo-600/50 rounded px-3 py-2 text-indigo-100"
                      />
                    ) : (
                      <p className="text-indigo-100">{entry.breach_source}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-300 mb-1">Severity</label>
                    {isEditing ? (
                      <select
                        value={editedEntry.severity}
                        onChange={(e) => handleChange('severity', e.target.value)}
                        className="w-full bg-indigo-800/50 border border-indigo-600/50 rounded px-3 py-2 text-indigo-100"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(entry.severity)}`}>
                        {entry.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-4">Compromised Data</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedEntry.compromised_data.join(', ')}
                    onChange={(e) => handleChange('compromised_data', e.target.value.split(',').map(item => item.trim()))}
                    className="w-full bg-indigo-800/50 border border-indigo-600/50 rounded px-3 py-2 text-indigo-100"
                    placeholder="Enter comma-separated values"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {entry.compromised_data.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-800/50 text-indigo-200 rounded-full text-sm border border-indigo-700/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {entry.breach_documents && entry.breach_documents.length > 0 && (
              <div className="bg-black/20 rounded-lg p-4 border border-indigo-700/30">
                <h3 className="text-sm font-medium text-indigo-300 mb-4">Related Documents</h3>
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

                  {entry.breach_documents.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentDocIndex(prev => 
                          prev > 0 ? prev - 1 : entry.breach_documents!.length - 1
                        )}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-indigo-900/80 text-indigo-200 rounded-full p-2 hover:bg-indigo-800/80 transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setCurrentDocIndex(prev => 
                          prev < entry.breach_documents!.length - 1 ? prev + 1 : 0
                        )}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-900/80 text-indigo-200 rounded-full p-2 hover:bg-indigo-800/80 transition-colors backdrop-blur-sm"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {entry.breach_documents.length > 1 && (
                  <div className="mt-4">
                    <div className="flex justify-center gap-2">
                      {entry.breach_documents.map((_, index) => (
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
      </div>
    </div>
  );
}

export default UserDetailModal;