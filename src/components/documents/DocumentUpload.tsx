// import React, { useState, useRef } from 'react';
// import { useDocuments } from '../../hooks/useDocuments';
// import { useAuth } from '../../hooks/useAuth';
// import LoadingSpinner from '../common/LoadingSpinner';

// interface DocumentUploadProps {
//   onUploadSuccess?: () => void;
//   onCancel?: () => void;
// }

// const DocumentUpload: React.FC<DocumentUploadProps> = ({
//   onUploadSuccess,
//   onCancel
// }) => {
//   const { uploadDocument } = useDocuments();
//   const { user } = useAuth();
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     tags: ''
//   });

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       // Set title from filename if not already set
//       if (!formData.title) {
//         setFormData(prev => ({
//           ...prev,
//           title: file.name.split('.')[0] // Remove extension
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
    
//     if (!selectedFile || !user) return;

//     setIsUploading(true);
//     try {
//       const tagsArray = formData.tags
//         .split(',')
//         .map(tag => tag.trim())
//         .filter(tag => tag.length > 0);

//       await uploadDocument(selectedFile,{
//         title: formData.title,
//         description: formData.description,
//         tags: tagsArray
//       });

//       // Reset form
//       setSelectedFile(null);
//       setFormData({ title: '', description: '', tags: '' });
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }

//       onUploadSuccess?.();
//     } catch (error) {
//       console.error('Upload failed:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDragOver = (event: React.DragEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
//   };

//   const handleDrop = (event: React.DragEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
    
//     const files = event.dataTransfer.files;
//     if (files.length > 0) {
//       setSelectedFile(files[0]);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold mb-6">Upload Document</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* File Upload Area */}
//         <div
//           className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 ${
//             selectedFile ? 'border-blue-400 bg-blue-50' : ''
//           }`}
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             onChange={handleFileSelect}
//             className="hidden"
//             accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
//           />
          
//           {selectedFile ? (
//             <div className="text-center">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <p className="font-medium text-gray-900">{selectedFile.name}</p>
//               <p className="text-sm text-gray-500">
//                 {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//               </p>
//             </div>
//           ) : (
//             <div className="text-center">
//               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                 </svg>
//               </div>
//               <p className="font-medium text-gray-900">Drag and drop your file here</p>
//               <p className="text-sm text-gray-500">or click to browse</p>
//               <p className="text-xs text-gray-400 mt-2">
//                 Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, GIF
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Metadata Form */}
//         <div className="space-y-4">
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//               Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               required
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter document title"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               id="description"
//               rows={3}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter document description (optional)"
//             />
//           </div>

//           <div>
//             <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
//               Tags
//             </label>
//             <input
//               type="text"
//               id="tags"
//               value={formData.tags}
//               onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter tags separated by commas (e.g., report, financial, 2024)"
//             />
//             <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex space-x-3 pt-4">
//           <button
//             type="submit"
//             disabled={!selectedFile || isUploading}
//             className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {isUploading && <LoadingSpinner size="sm" />}
//             <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
//           </button>
          
//           {onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DocumentUpload;

import React, { useState, useRef } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import { DocumentUploadData } from '../../types';

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
  onCancel?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  onCancel
}) => {
  const { uploadDocument } = useDocuments();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    department: 'general' // Added department field with default value
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Set title from filename if not already set
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.split('.')[0] // Remove extension
        }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create proper DocumentUploadData object
      const uploadData: DocumentUploadData = {
        file: selectedFile,
        title: formData.title,
        description: formData.description,
        department: formData.department,
        tag_ids: tagsArray,
        permissions: [] // Add empty permissions array as required
      };

      await uploadDocument(uploadData);

      // Reset form
      setSelectedFile(null);
      setFormData({ 
        title: '', 
        description: '', 
        tags: '',
        department: 'general' 
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upload Document</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 ${
            selectedFile ? 'border-blue-400 bg-blue-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
          />
          
          {selectedFile ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Drag and drop your file here</p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, GIF
              </p>
            </div>
          )}
        </div>

        {/* Metadata Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document description (optional)"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              id="department"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="finance">Finance</option>
              <option value="hr">Human Resources</option>
              <option value="it">IT</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags separated by commas (e.g., report, financial, 2024)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading && <LoadingSpinner size={16} />}
            <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;