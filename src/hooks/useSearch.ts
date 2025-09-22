import { useState } from 'react';
import { DocumentService } from '../services/document';

export function useSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchDocuments = async (query: string, tags: string[] = []) => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const response = await DocumentService.searchDocuments({ query, tags });
      setResults(response.items || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchDocuments };
}