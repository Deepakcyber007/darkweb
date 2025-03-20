import React, { useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { NewEntryForm } from '../../types/admin';

interface AddEntryModalProps {
  show: boolean;
  onClose: () => void;
  newEntry: NewEntryForm;
  onNewEntryChange: (entry: NewEntryForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function AddEntryModal({
  show,
  onClose,
  newEntry,
  onNewEntryChange,
  onSubmit
}: AddEntryModalProps) {
  const profilePicRef = useRef<HTMLInputElement>(null);
  const documentsRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onNewEntryChange({ ...newEntry, profile_picture: e.target.files[0] });
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onNewEntryChange({ ...newEntry, breach_documents: Array.from(e.target.files) });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Data Breach Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {newEntry.profile_picture && (
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(newEntry.profile_picture)}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => profilePicRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ImageIcon size={20} />
                  {newEntry.profile_picture ? 'Change Picture' : 'Upload Picture'}
                </button>
                <input
                  ref={profilePicRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newEntry.name}
                onChange={(e) => onNewEntryChange({ ...newEntry, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={newEntry.email}
                onChange={(e) => onNewEntryChange({ ...newEntry, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={newEntry.phone}
                onChange={(e) => onNewEntryChange({ ...newEntry, phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breach Date
              </label>
              <input
                type="date"
                required
                value={newEntry.breach_date}
                onChange={(e) => onNewEntryChange({ ...newEntry, breach_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breach Source
              </label>
              <input
                type="text"
                required
                value={newEntry.breach_source}
                onChange={(e) => onNewEntryChange({ ...newEntry, breach_source: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                required
                value={newEntry.severity}
                onChange={(e) => onNewEntryChange({ ...newEntry, severity: e.target.value as 'high' | 'medium' | 'low' })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compromised Data (comma-separated)
              </label>
              <input
                type="text"
                required
                value={newEntry.compromised_data}
                onChange={(e) => onNewEntryChange({ ...newEntry, compromised_data: e.target.value })}
                placeholder="Email, Password, Phone Number, etc."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breach Documents
              </label>
              <div className="flex items-center gap-4">
                {newEntry.breach_documents && newEntry.breach_documents.length > 0 && (
                  <div className="flex gap-2">
                    {newEntry.breach_documents.map((doc, index) => (
                      <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {doc.name}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => documentsRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Upload size={20} />
                  Upload Documents
                </button>
                <input
                  ref={documentsRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleDocumentsChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEntryModal