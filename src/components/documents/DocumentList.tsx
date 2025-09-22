import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import { useDocuments } from '../../hooks/useDocuments';
import DocumentCard from './DocumentCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

interface DocumentListProps {
  onDocumentSelect?: (document: Document) => void;
  showActions?: boolean;
  filter?: (document: Document) => boolean;
  documents?: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({
  onDocumentSelect,
  showActions = true,
  filter,
  documents: externalDocuments
}) => {
  const { documents: hookDocuments, loading, error, deleteDocument } = useDocuments();
  const { user } = useAuth();
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  const documentsToUse = externalDocuments || hookDocuments;

  useEffect(() => {
    if (documentsToUse) {
      const filtered = filter ? documentsToUse.filter(filter) : documentsToUse;
      setFilteredDocuments(filtered);
    }
  }, [documentsToUse, filter]);

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(documentId);
    }
  };

  if (loading && !externalDocuments) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDocuments.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onSelect={onDocumentSelect}
          onDelete={showActions ? handleDelete : undefined}
          showActions={showActions && document.ownerId === user?.id}
        />
      ))}
      {filteredDocuments.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-8">
          No documents found
        </div>
      )}
    </div>
  );
};

export default DocumentList;