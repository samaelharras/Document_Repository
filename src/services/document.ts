import axios from 'axios';
import {
  Document as CustomDocument,
  DocumentVersion,
  DocumentStats,
  PaginatedResponse,
  ApiResponse,
  UploadProgress,
  DocumentUploadData,
  DocumentSearchParams
} from '../types';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload, apiDownload } from './api';

export class DocumentService {

  static async uploadDocument(
    documentData: DocumentUploadData,
    onUploadProgress?: (progress: UploadProgress) => void
  ): Promise<CustomDocument> {
    const formData = new FormData();
    
    formData.append('file', documentData.file);
    
    formData.append('title', documentData.title);
    if (documentData.description) {
      formData.append('description', documentData.description);
    }
    formData.append('department', documentData.department);
    
    if (documentData.tag_ids.length > 0) {
      formData.append('tag_ids', JSON.stringify(documentData.tag_ids));
    }
    
    if (documentData.permissions && documentData.permissions.length > 0) {
      formData.append('permissions', JSON.stringify(documentData.permissions));
    }

    const response = await apiUpload<{ document: CustomDocument }>(
      '/documents/upload',
      formData,
      onUploadProgress ? (progressEvent: any) => {
        const progress: UploadProgress = {
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
        };
        onUploadProgress(progress);
      } : undefined
    );

    return response.document;
  }


  static async searchDocuments(
    searchParams: DocumentSearchParams = {},
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<CustomDocument>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (searchParams.query) params.append('query', searchParams.query);
    if (searchParams.department) params.append('department', searchParams.department);
    if (searchParams.fileType) params.append('file_type', searchParams.fileType);
    if (searchParams.tags && searchParams.tags.length > 0) {
      searchParams.tags.forEach(tag => params.append('tags', tag));
    }
    if (searchParams.sortBy) params.append('sort_by', searchParams.sortBy);
    if (searchParams.sortOrder) params.append('sort_order', searchParams.sortOrder);

    return apiGet<PaginatedResponse<CustomDocument>>(`/documents/?${params.toString()}`);
  }


  static async getDocument(id: string): Promise<CustomDocument> { 
    return apiGet<CustomDocument>(`/documents/${id}`);
  }


// static async getDocument(id: string): Promise<CustomDocument> {
//   try {
//     console.log('=== DEBUG: Starting getDocument ===');
//     console.log('Document ID:', id);
    
//     // Use the raw axios call to see the complete response
//     const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
//     const response = await axios.get(`${API_BASE_URL}/documents/${id}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//         'Content-Type': 'application/json',
//       },
//     });
    
//     console.log('=== DEBUG: Full API Response ===');
//     console.log('Response status:', response.status);
//     console.log('Response headers:', response.headers);
//     console.log('Response data:', response.data);
//     console.log('Response data type:', typeof response.data);
    
//     // Check the structure of the response
//     if (response.data && typeof response.data === 'object') {
//       if (response.data.document) {
//         console.log('Document found in: response.data.document');
//         return response.data.document;
//       } else if (response.data.data) {
//         console.log('Document found in: response.data.data');
//         return response.data.data;
//       } else {
//         console.log('Document is: response.data (direct)');
//         return response.data;
//       }
//     }
    
//     throw new Error('Invalid response format from API');
    
//   } catch (error: any) {
//     console.error('=== DEBUG: Error in getDocument ===');
//     console.error('Error message:', error.message);
//     console.error('Error response:', error.response?.data);
//     console.error('Error status:', error.response?.status);
//     console.error('Error headers:', error.response?.headers);
    
//     throw error;
//   }
// }


  static async updateDocument(
    id: string,
    updates: Partial<DocumentUploadData>,
    file?: File
  ): Promise<CustomDocument> {
    if (file) {
      // Update with file upload
      const formData = new FormData();
      formData.append('file', file);
      
      if (updates.title) formData.append('title', updates.title);
      if (updates.description) formData.append('description', updates.description);
      if (updates.tag_ids) formData.append('tag_ids', JSON.stringify(updates.tag_ids));
      if (updates.permissions) formData.append('permissions', JSON.stringify(updates.permissions));

      return apiUpload<CustomDocument>(`/documents/${id}`, formData);
    } else {
      return apiPut<CustomDocument>(`/documents/${id}`, updates);
    }
  }


  static async deleteDocument(id: string): Promise<ApiResponse> {
    return apiDelete<ApiResponse>(`/documents/${id}`);
  }


  static async downloadDocument(id: string): Promise<Blob> {
    const result = await apiDownload(`/documents/${id}/download`);
    if (!result) {
      throw new Error('Failed to download document: no data received.');
    }
    return result;
  }


  static async getDocumentVersions(id: string): Promise<DocumentVersion[]> {
    return apiGet<DocumentVersion[]>(`/documents/${id}/versions`);
  }


  static async getDocumentStats(): Promise<DocumentStats> {
    return apiGet<DocumentStats>('/documents/stats/overview');
  }


  static async bulkDeleteDocuments(documentIds: string[]): Promise<ApiResponse> {
    return apiPost<ApiResponse>('/documents/bulk', {
      document_ids: documentIds,
      operation: 'delete',
    });
  }


  static async getRecentDocuments(limit: number = 10): Promise<CustomDocument[]> {
    const response = await this.searchDocuments(
      { sortBy: 'createdAt', sortOrder: 'desc' },
      1,
      limit
    );
    return response.items;
  }


  static async getDocumentsByDepartment(
    department: string,
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<CustomDocument>> {
    return this.searchDocuments({ department }, page, size);
  }


  static async getDocumentsByTags(
    tags: string[],
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<CustomDocument>> {
    return this.searchDocuments({ tags }, page, size);
  }


  static async getAllDocuments(page: number = 1, size: number = 20): Promise<PaginatedResponse<CustomDocument>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return apiGet<PaginatedResponse<CustomDocument>>(`/documents/?${params.toString()}`);
  }


  static getFileTypeIcon(fileType: string): string {
    const iconMap: Record<string, string> = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📄',
      xls: '📊',
      xlsx: '📊',
      ppt: '📋',
      pptx: '📋',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      zip: '📦',
      rar: '📦',
      '7z': '📦',
    };

    return iconMap[fileType.toLowerCase()] || '📄';
  }


  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


  static getFileCategoryColor(fileType: string): string {
    const colorMap: Record<string, string> = {
      pdf: '#d32f2f',
      doc: '#1976d2',
      docx: '#1976d2',
      txt: '#757575',
      xls: '#388e3c',
      xlsx: '#388e3c',
      ppt: '#f57c00',
      pptx: '#f57c00',
      jpg: '#9c27b0',
      jpeg: '#9c27b0',
      png: '#9c27b0',
      gif: '#9c27b0',
      zip: '#5d4037',
      rar: '#5d4037',
      '7z': '#5d4037',
    };

    return colorMap[fileType.toLowerCase()] || '#616161';
  }
}