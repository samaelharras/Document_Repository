import React from 'react';
import { Document } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { getFileIcon } from '../../utils/helpers';

interface DocumentCardProps {
  document: Document;
  onSelect?: (document: Document) => void;
  onDelete?: (documentId: string) => void;
  showActions?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onSelect,
  onDelete,
  showActions = true
}) => {
  const handleClick = () => {
    onSelect?.(document);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(document.id);
  };

  const fileIcon = getFileIcon(document.fileType);

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{fileIcon}</span>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete document"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
          {document.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {document.description || 'No description'}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Size:</span>
            <span className="font-medium">{formatFileSize(document.fileSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium">{document.fileType.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Uploaded:</span>
            <span className="font-medium">{formatDate(document.createdAt)}</span>
          </div>
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {document.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {document.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{document.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;