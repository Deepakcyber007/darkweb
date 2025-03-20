import React from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { DataEntry } from '../../types/admin';

interface DataTableProps {
  data: DataEntry[];
  selectedEntries: string[];
  onSelectEntry: (id: string) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
  onDelete: (id: string) => void;
  getSeverityColor: (severity: string) => string;
  getStatusColor: (status: string) => string;
}

function DataTable({
  data,
  selectedEntries,
  onSelectEntry,
  onSelectAll,
  onStatusChange,
  onDelete,
  getSeverityColor,
  getStatusColor,
}: DataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedEntries.length === data.length}
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name & Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Breach Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => onSelectEntry(entry.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                  <div className="text-sm text-gray-500">{entry.email}</div>
                  <div className="text-sm text-gray-500">{entry.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="mb-1">{entry.breach_source}</div>
                    <div className="text-gray-500">{entry.breach_date}</div>
                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getSeverityColor(entry.severity)
                    }`}>
                      {entry.severity.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    getStatusColor(entry.status)
                  }`}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                  {entry.removal_requested && (
                    <div className="mt-1 text-xs text-gray-500">
                      Requested: {entry.request_date}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onStatusChange(entry.id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                      title="Approve"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => onStatusChange(entry.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                      title="Reject"
                    >
                      <XCircle size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;