import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFormProps {
  searchQuery: string;
  searchType: 'email' | 'phone' | 'name';
  showFilters: boolean;
  dateRange: { start: string; end: string };
  isLoading: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearchTypeChange: (type: 'email' | 'phone' | 'name') => void;
  onShowFiltersChange: (show: boolean) => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function SearchForm({
  searchQuery,
  searchType,
  showFilters,
  dateRange,
  isLoading,
  onSearchQueryChange,
  onSearchTypeChange,
  onShowFiltersChange,
  onDateRangeChange,
  onSubmit
}: SearchFormProps) {
  return (
    <div className="rounded-lg p-4 sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <div className="relative">
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => onSearchTypeChange('email')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      searchType === 'email'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => onSearchTypeChange('phone')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      searchType === 'phone'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => onSearchTypeChange('name')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      searchType === 'name'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
                    }`}
                  >
                    Name
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={searchType === 'email' ? 'email' : 'text'}
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder={`Enter ${
                      searchType === 'email' 
                        ? 'email address' 
                        : searchType === 'phone' 
                          ? 'phone number' 
                          : 'full name'
                    }`}
                    className="w-full p-3 bg-indigo-900/50 text-white placeholder-indigo-300 border border-indigo-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10 transition-colors"
                    required
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:mt-8">
              <button
                type="button"
                onClick={() => onShowFiltersChange(!showFilters)}
                className="flex-1 sm:flex-none p-3 bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 rounded-lg hover:bg-indigo-800/50 transition-colors"
                title="Toggle filters"
              >
                <Filter size={20} />
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 justify-center min-w-[120px] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-indigo-900/50 p-4 rounded-lg space-y-4 border border-indigo-700/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-indigo-200">Additional Filters</h3>
                <button
                  type="button"
                  onClick={() => onShowFiltersChange(false)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  <X size={20} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-1">
                  Date Range
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                    className="w-full p-2 bg-indigo-800/50 text-white border border-indigo-600/50 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                    className="w-full p-2 bg-indigo-800/50 text-white border border-indigo-600/50 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchForm;