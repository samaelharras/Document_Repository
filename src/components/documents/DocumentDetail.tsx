import React, { useState } from 'react';
import { Document } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { getFileIcon, downloadFile } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

interface DocumentDetailProps {
  document: Document;
  onClose: () => void;
  onUpdate?: (document: Document) => void;
  onDelete?: (documentId: string) => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({
  document,
  onClose,
  onUpdate,
  onDelete
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(document);

  const handleSave = () => {
    onUpdate?.(editedDocument);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDocument(document);
    setIsEditing(false);
  };

  const handleDownload = async () => {
    try {
      await downloadFile(document.id, document.title, document.fileType);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isOwner = document.ownerId === user?.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Icon and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-3xl">{getFileIcon(document.fileType)}</span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedDocument.title}
                  onChange={(e) => setEditedDocument({ ...editedDocument, title: e.target.value })}
                  className="w-full text-lg font-semibold border border-gray-300 rounded px-3 py-2"
                />
              ) : (
                <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
              )}
              <p className="text-gray-600">{document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={editedDocument.description || ''}
                onChange={(e) => setEditedDocument({ ...editedDocument, description: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-gray-600">{document.description || 'No description provided'}</p>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Uploaded:</span>
              <p className="text-gray-600">{formatDate(document.createdAt)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>
              <p className="text-gray-600">{formatDate(document.updatedAt)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <p className="text-gray-600">v{document.version}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className="text-gray-600 capitalize">{document.status}</p>
            </div>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>

            {isOwner && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(document.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;