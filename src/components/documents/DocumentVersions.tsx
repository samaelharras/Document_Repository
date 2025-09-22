import React from 'react';
import { Document, DocumentVersion } from '../../types';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { getFileIcon } from '../../utils/helpers';

interface DocumentVersionsProps {
  document: Document;
  versions: DocumentVersion[];
  onVersionRestore?: (versionId: string) => void;
  onVersionDownload?: (versionId: string) => void;
}

const DocumentVersions: React.FC<DocumentVersionsProps> = ({
  document,
  versions,
  onVersionRestore,
  onVersionDownload
}) => {
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Document Versions</h2>
      
      <div className="space-y-4">
        {/* Current Version */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">{getFileIcon(document.fileType)}</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Current Version (v{document.version})</h3>
                <p className="text-sm text-blue-600">
                  {formatDate(document.updatedAt)} • {formatFileSize(document.fileSize)}
                </p>
              </div>
            </div>
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Current
            </span>
          </div>
        </div>

        {/* Version History */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-4">Version History</h3>
          
          {sortedVersions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No previous versions found</p>
          ) : (
            <div className="space-y-3">
              {sortedVersions.map((version, index) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">{getFileIcon(version.fileType)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">v{version.version}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(version.createdAt)} • {formatFileSize(version.fileSize)}
                      </p>
                      {version.changeDescription && (
                        <p className="text-xs text-gray-500 mt-1">
                          {version.changeDescription}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onVersionDownload?.(version.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download this version"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    
                    {index > 0 && ( // Don't show restore for current version
                      <button
                        onClick={() => onVersionRestore?.(version.id)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Restore this version"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVersions;