import React, { useState } from 'react';
import { Shield, Search, Lock, Clock, AlertTriangle, CheckCircle, Database, ShieldCheck, Eye, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SearchForm from '../components/home/SearchForm';
import SearchResult from '../components/home/SearchResult';
import PaymentModal from '../components/home/PaymentModal';
import { SearchResult as SearchResultType } from '../types/home';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'phone' | 'name'>('email');
  const [searchResult, setSearchResult] = useState<SearchResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setSearchResult(null);
    
    try {
      let query = supabase
        .from('data_breaches')
        .select('*')
        .eq('status', 'approved');

      const searchValue = searchQuery.trim();
      
      switch (searchType) {
        case 'email':
          query = query.ilike('email', `%${searchValue}%`);
          break;
        case 'phone':
          query = query.ilike('phone', `%${searchValue}%`);
          break;
        case 'name':
          query = query.ilike('name', `%${searchValue}%`);
          break;
      }

      if (dateRange.start) {
        query = query.gte('breach_date', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('breach_date', dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const sortedData = data.sort((a, b) => 
          new Date(b.breach_date).getTime() - new Date(a.breach_date).getTime()
        );

        setSearchResult({
          found: true,
          data: {
            name: sortedData[0].name,
            email: sortedData[0].email,
            phone: sortedData[0].phone,
            breach_date: sortedData[0].breach_date,
            breach_source: sortedData[0].breach_source,
            compromised_data: sortedData[0].compromised_data,
            severity: sortedData[0].severity,
            profile_picture: sortedData[0].profile_picture,
            breach_documents: sortedData[0].breach_documents
          }
        });
      } else {
        setSearchResult({ found: false });
      }
    } catch (err) {
      console.error('Error searching data:', err);
      alert('An error occurred while searching. Please try again.');
      setSearchResult({ found: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovalRequest = () => {
    if (!searchResult?.data) return;
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    if (!searchResult?.data) return;
    
    try {
      const { error } = await supabase
        .from('data_breaches')
        .update({
          removal_requested: true,
          request_date: new Date().toISOString()
        })
        .match({
          email: searchResult.data.email,
          phone: searchResult.data.phone
        });

      if (error) throw error;
      
      setShowPaymentModal(false);
      alert('Thank you for your payment. Your removal request has been submitted. We will process your request within 48 hours.');
    } catch (err) {
      console.error('Error submitting removal request:', err);
      alert('Failed to submit removal request. Please try again.');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-500 bg-opacity-20 rounded-2xl mb-6 backdrop-blur-sm border border-indigo-400 border-opacity-20">
              <Shield className="text-indigo-400 w-8 h-8" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Secure Your Digital Footprint
            </h1>
            <p className="text-xl text-indigo-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Instantly discover if your personal information has been compromised in data breaches. Take control of your online security today.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30">
                <div className="text-3xl font-bold text-indigo-400 mb-1">500M+</div>
                <div className="text-sm text-indigo-300">Records Scanned</div>
              </div>
              <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-700/30">
                <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-sm text-purple-300">Monitoring</div>
              </div>
              <div className="bg-pink-900/30 backdrop-blur-sm rounded-xl p-4 border border-pink-700/30">
                <div className="text-3xl font-bold text-pink-400 mb-1">99.9%</div>
                <div className="text-sm text-pink-300">Accuracy Rate</div>
              </div>
              <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                <div className="text-3xl font-bold text-slate-400 mb-1">1000+</div>
                <div className="text-sm text-slate-300">Breaches Tracked</div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto backdrop-blur-sm bg-indigo-900/30 p-6 rounded-2xl border border-indigo-700/30">
            <SearchForm
              searchQuery={searchQuery}
              searchType={searchType}
              showFilters={showFilters}
              dateRange={dateRange}
              isLoading={isLoading}
              onSearchQueryChange={setSearchQuery}
              onSearchTypeChange={setSearchType}
              onShowFiltersChange={setShowFilters}
              onDateRangeChange={setDateRange}
              onSubmit={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {searchResult && (
            <SearchResult
              result={searchResult}
              onRemovalRequest={handleRemovalRequest}
              getSeverityColor={getSeverityColor}
            />
          )}

          <PaymentModal
            show={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Comprehensive Protection Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-indigo-900/30 p-6 rounded-xl border border-indigo-700/30 hover:border-indigo-500 transition-colors">
              <Database className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-200">Deep Web Scanning</h3>
              <p className="text-indigo-300">Continuous monitoring of dark web marketplaces and forums</p>
            </div>
            <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-700/30 hover:border-purple-500 transition-colors">
              <ShieldCheck className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-purple-200">Instant Alerts</h3>
              <p className="text-purple-300">Real-time notifications when your data is compromised</p>
            </div>
            <div className="bg-pink-900/30 p-6 rounded-xl border border-pink-700/30 hover:border-pink-500 transition-colors">
              <Eye className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-pink-200">Privacy Monitoring</h3>
              <p className="text-pink-300">Track and protect your personal information online</p>
            </div>
            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-700/30 hover:border-slate-500 transition-colors">
              <Key className="w-10 h-10 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-slate-200">Data Removal</h3>
              <p className="text-slate-300">Professional assistance in removing your exposed data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-indigo-500/20 px-6 py-3 rounded-full border border-indigo-400/20 mb-8">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-medium">
              Trusted by Over 100,000 Users Worldwide
            </span>
          </div>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            We continuously update our database with new breach information and employ state-of-the-art security measures to protect your data. Regular checks help ensure your digital identity remains secure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;