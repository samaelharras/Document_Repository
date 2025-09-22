import React, { useState, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import DocumentList from './DocumentList';
import LoadingSpinner from '../common/LoadingSpinner';

interface DocumentSearchProps {
  onDocumentSelect?: (document: any) => void;
  showFilters?: boolean;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  onDocumentSelect,
  showFilters = true
}) => {
  const { searchDocuments, results, loading, error } = useSearch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    fileType: '',
    dateFrom: '',
    dateTo: '',
    tags: ''
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm || Object.values(filters).some(filter => filter !== '')) {
      performSearch();
    }
  }, [debouncedSearchTerm, filters]);

  const performSearch = async () => {
    const searchParams: any = {};
    
    if (debouncedSearchTerm) {
      searchParams.q = debouncedSearchTerm;
    }
    
    if (filters.fileType) {
      searchParams.fileType = filters.fileType;
    }
    
    if (filters.dateFrom) {
      searchParams.dateFrom = filters.dateFrom;
    }
    
    if (filters.dateTo) {
      searchParams.dateTo = filters.dateTo;
    }
    
    if (filters.tags) {
      searchParams.tags = filters.tags.split(',').map((tag: string) => tag.trim());
    }

    await searchDocuments(searchParams);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      fileType: '',
      dateFrom: '',
      dateTo: '',
      tags: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '') || searchTerm !== '';

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title, description, or content..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
              <select
                value={filters.fileType}
                onChange={(e) => handleFilterChange('fileType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All types</option>
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="ppt">PPT</option>
                <option value="pptx">PPTX</option>
                <option value="txt">TXT</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                placeholder="tag1, tag2, ..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Results Summary and Clear Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {loading ? 'Searching...' : `Found ${results.length} documents`}
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            Error: {error}
          </div>
        ) : (
          <DocumentList
            documents={results}
            onDocumentSelect={onDocumentSelect}
            showActions={false}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentSearch;