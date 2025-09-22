import { useState, useEffect, useCallback } from 'react';
import { DocumentService } from '../services/document';
import { Document as CustomDocument, DeleteDocumentResponse, DocumentUploadData } from '../types';

export function useDocuments() {
  const [documents, setDocuments] = useState<CustomDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await DocumentService.getAllDocuments();
        setDocuments(response.items || []);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const uploadDocument = useCallback(async (
    documentData: DocumentUploadData,
    onUploadProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<CustomDocument> => {
    setUploading(true);
    setError('');
    
    try {
      // Call the DocumentService upload method with the correct signature
      const uploadedDocument = await DocumentService.uploadDocument(
        documentData,
        onUploadProgress
      );
      
      // Add the new document to local state
      setDocuments(prev => [uploadedDocument, ...prev]);
      
      return uploadedDocument;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to upload document';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string): Promise<DeleteDocumentResponse> => {
    setDeletingId(documentId);
    setError('');
    
    try {
      // Call the DocumentService delete method
      const response = await DocumentService.deleteDocument(documentId);
      
      // Remove the document from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      return {
        success: true,
        message: 'Document deleted successfully',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete document';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setDeletingId(null);
    }
  }, []);

  const refreshDocuments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await DocumentService.getAllDocuments();
      setDocuments(response.items || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to refresh documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const isDeleting = (documentId: string) => deletingId === documentId;

  return { 
    documents, 
    loading, 
    error, 
    uploading,
    deleteDocument,
    uploadDocument,
    refreshDocuments,
    isDeleting,
    deletingId
  };
}