import React, { useState, useEffect } from 'react';
import { Filter, Download, Upload, Plus, Trash2, LayoutGrid, LayoutList } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminAuthForm from '../components/admin/AdminAuthForm';
import DataTable from '../components/admin/DataTable';
import Filters from '../components/admin/Filters';
import AddEntryModal from '../components/admin/AddEntryModal';
import UserCard from '../components/admin/UserCard';
import UserDetailModal from '../components/admin/UserDetailModal';
import { DataEntry, NewEntryForm } from '../types/admin';

function AdminPage() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    dateRange: { start: '', end: '' },
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DataEntry | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [newEntry, setNewEntry] = useState<NewEntryForm>({
    name: '',
    email: '',
    phone: '',
    breach_date: '',
    breach_source: '',
    compromised_data: '',
    severity: 'medium'
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdminAndFetchData(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminAndFetchData(session);
      } else {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminAndFetchData = async (session) => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (adminError || !adminData) {
        throw new Error('Unauthorized access');
      }

      fetchData();
    } catch (err) {
      console.error('Error checking admin status:', err);
      alert('You are not authorized to access this page');
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  const fetchData = async () => {
    try {
      const { data: breachData, error } = await supabase
        .from('data_breaches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setData(breachData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('data_breaches')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setData(data.map(entry => 
        entry.id === id ? { ...entry, status } : entry
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry? This action cannot be undone.');
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('data_breaches')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setData(data.filter(entry => entry.id !== id));
        setShowDetailModal(false);
      } catch (err) {
        console.error('Error deleting entry:', err);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedEntries.length} entries? This action cannot be undone.`);
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('data_breaches')
          .delete()
          .in('id', selectedEntries);

        if (error) throw error;

        setData(data.filter(entry => !selectedEntries.includes(entry.id)));
        setSelectedEntries([]);
      } catch (err) {
        console.error('Error deleting entries:', err);
        alert('Failed to delete entries. Please try again.');
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEntries(data.map(entry => entry.id));
    } else {
      setSelectedEntries([]);
    }
  };

  const handleSelectEntry = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const handleSaveEntry = async (updatedEntry: DataEntry) => {
    try {
      const { error } = await supabase
        .from('data_breaches')
        .update(updatedEntry)
        .eq('id', updatedEntry.id);

      if (error) throw error;

      setData(data.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
      
      alert('Entry updated successfully');
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Failed to update entry. Please try again.');
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let profilePictureUrl = null;
      let documentUrls = [];

      // Upload profile picture if provided
      if (newEntry.profile_picture) {
        const fileName = `${Date.now()}-${newEntry.profile_picture.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, newEntry.profile_picture);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);
          
        profilePictureUrl = publicUrl;
      }

      // Upload documents if provided
      if (newEntry.breach_documents && newEntry.breach_documents.length > 0) {
        for (const doc of newEntry.breach_documents) {
          const fileName = `${Date.now()}-${doc.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('breach-documents')
            .upload(fileName, doc);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('breach-documents')
            .getPublicUrl(fileName);

          documentUrls.push(publicUrl);
        }
      }

      const newData = {
        name: newEntry.name,
        email: newEntry.email,
        phone: newEntry.phone,
        breach_date: newEntry.breach_date,
        breach_source: newEntry.breach_source,
        compromised_data: newEntry.compromised_data.split(',').map(item => item.trim()),
        severity: newEntry.severity,
        removal_requested: false,
        status: 'pending',
        profile_picture: profilePictureUrl,
        breach_documents: documentUrls
      };

      const { data: insertedData, error } = await supabase
        .from('data_breaches')
        .insert([newData])
        .select()
        .single();

      if (error) throw error;

      setData([insertedData, ...data]);
      setShowAddModal(false);
      setNewEntry({
        name: '',
        email: '',
        phone: '',
        breach_date: '',
        breach_source: '',
        compromised_data: '',
        severity: 'medium'
      });
    } catch (err) {
      console.error('Error adding entry:', err);
      alert('Failed to add entry. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const filteredData = data.filter(entry => {
    if (filters.status && entry.status !== filters.status) return false;
    if (filters.severity && entry.severity !== filters.severity) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        entry.name.toLowerCase().includes(searchLower) ||
        entry.email.toLowerCase().includes(searchLower) ||
        entry.phone.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!session) {
    return <AdminAuthForm />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-indigo-300">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <div>Error loading data: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-indigo-200 mb-2">Admin Dashboard</h1>
              <p className="text-indigo-300">Manage data breach entries and removal requests</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Entry
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 rounded-lg hover:bg-indigo-800/50 transition-colors flex items-center gap-2"
              >
                <Filter size={20} />
                Filters
              </button>
              <button
                className="px-4 py-2 bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 rounded-lg hover:bg-indigo-800/50 transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                Export
              </button>
              <button
                className="px-4 py-2 bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 rounded-lg hover:bg-indigo-800/50 transition-colors flex items-center gap-2"
              >
                <Upload size={20} />
                Import
              </button>
              <div className="border-l border-indigo-700/30 mx-2" />
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 hover:bg-indigo-800/50'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 hover:bg-indigo-800/50'
                }`}
              >
                <LayoutList size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}

          {selectedEntries.length > 0 && (
            <div className="bg-indigo-900/30 p-4 rounded-lg mb-6 flex items-center justify-between border border-indigo-700/30">
              <div className="flex items-center gap-2">
                <span className="font-medium text-indigo-200">{selectedEntries.length} entries selected</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={20} />
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map(entry => (
              <UserCard
                key={entry.id}
                entry={entry}
                onClick={() => {
                  setSelectedEntry(entry);
                  setShowDetailModal(true);
                }}
                onStatusChange={handleStatusChange}
                getSeverityColor={getSeverityColor}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        ) : (
          <DataTable
            data={filteredData}
            selectedEntries={selectedEntries}
            onSelectEntry={handleSelectEntry}
            onSelectAll={handleSelectAll}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        )}

        <AddEntryModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          newEntry={newEntry}
          onNewEntryChange={setNewEntry}
          onSubmit={handleAddEntry}
        />

        {showDetailModal && selectedEntry && (
          <UserDetailModal
            entry={selectedEntry}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedEntry(null);
            }}
            onSave={handleSaveEntry}
            onDelete={handleDelete}
            getSeverityColor={getSeverityColor}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPage;