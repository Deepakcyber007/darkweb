import React from 'react';
import { Phone, Mail, Calendar, Shield, Edit, CheckCircle, XCircle } from 'lucide-react';
import { DataEntry } from '../../types/admin';

interface UserCardProps {
  entry: DataEntry;
  onClick: () => void;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
  getSeverityColor: (severity: string) => string;
  getStatusColor: (status: string) => string;
}

function UserCard({ entry, onClick, onStatusChange, getSeverityColor, getStatusColor }: UserCardProps) {
  const handleStatusChange = (e: React.MouseEvent, status: 'approved' | 'rejected') => {
    e.stopPropagation();
    onStatusChange(entry.id, status);
  };

  return (
    <div 
      className="bg-indigo-900/30 rounded-lg border border-indigo-700/30 hover:border-indigo-500/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
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
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-200 group-hover:text-indigo-100 transition-colors">
                  {entry.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(entry.severity)}`}>
                    {entry.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(entry.status)}`}>
                    {entry.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleStatusChange(e, 'approved')}
                  className={`p-1.5 rounded-full transition-colors ${
                    entry.status === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'text-green-400 hover:text-green-300'
                  }`}
                  title="Approve"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={(e) => handleStatusChange(e, 'rejected')}
                  className={`p-1.5 rounded-full transition-colors ${
                    entry.status === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'text-red-400 hover:text-red-300'
                  }`}
                  title="Reject"
                >
                  <XCircle size={18} />
                </button>
                <button className="p-1.5 text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit size={18} />
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2 text-sm text-indigo-300">
                <Mail size={14} className="text-indigo-400" />
                <span>{entry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-300">
                <Phone size={14} className="text-indigo-400" />
                <span>{entry.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-300">
                <Calendar size={14} className="text-indigo-400" />
                <span>{entry.breach_date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-300">
                <Shield size={14} className="text-indigo-400" />
                <span>{entry.breach_source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {entry.removal_requested && (
        <div className="px-4 py-2 border-t border-indigo-700/30 bg-red-900/20">
          <p className="text-xs text-red-300">
            Removal requested on: {new Date(entry.request_date!).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default UserCard;