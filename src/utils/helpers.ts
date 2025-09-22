import { ApiError } from "../types";
import { DeleteDocumentResponse } from "../types";

export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}
export function getFileIcon(filename: string): string {
  if (!filename) return 'file';
  
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  const iconMap: Record<string, string> = {
    'pdf': 'file-pdf',
    'doc': 'file-word',
    'docx': 'file-word',
    'txt': 'file-alt',
    'rtf': 'file-alt',
    
    'xls': 'file-excel',
    'xlsx': 'file-excel',
    'csv': 'file-csv',
    
    'ppt': 'file-powerpoint',
    'pptx': 'file-powerpoint',
    
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'png': 'file-image',
    'gif': 'file-image',
    'bmp': 'file-image',
    'svg': 'file-image',
    'webp': 'file-image',
    
    'mp3': 'file-audio',
    'wav': 'file-audio',
    'ogg': 'file-audio',
    'flac': 'file-audio',
    
    'mp4': 'file-video',
    'avi': 'file-video',
    'mov': 'file-video',
    'wmv': 'file-video',
    'mkv': 'file-video',
    
    'zip': 'file-archive',
    'rar': 'file-archive',
    '7z': 'file-archive',
    'tar': 'file-archive',
    'gz': 'file-archive',
    
    'js': 'file-code',
    'ts': 'file-code',
    'html': 'file-code',
    'css': 'file-code',
    'json': 'file-code',
    'xml': 'file-code',
    'py': 'file-code',
    'java': 'file-code',
    'cpp': 'file-code',
    'c': 'file-code',
    'php': 'file-code',
    'rb': 'file-code',
    
    'exe': 'cog',
    'dll': 'cog',
    'ini': 'cog',
    'config': 'cog'
  };
  
  return iconMap[extension] || 'file';
}

export function downloadFile(
  data: string | Blob,
  filename: string,
  fileTypeOrOptions?: string | {
    mimeType?: string;
    charset?: string;
    bom?: string;
  }
): void {
  let options: {
    mimeType?: string;
    charset?: string;
    bom?: string;
  } = {};
  
  if (typeof fileTypeOrOptions === 'string') {
    options = { mimeType: fileTypeOrOptions };
  } else if (fileTypeOrOptions) {
    options = fileTypeOrOptions;
  }
  
  try {
    let blob: Blob;
    
    const isBlob = (value: any): value is Blob => 
      value instanceof Blob || 
      (typeof value === 'object' && value !== null && typeof value.arrayBuffer === 'function');
    
    if (isBlob(data)) {
      blob = data;
    } else if (typeof data === 'string') {
      if (data.startsWith('http://') || data.startsWith('https://')) {
        window.open(data, '_blank');
        return;
      } else if (data.startsWith('data:')) {
        const parts = data.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || options.mimeType || 'application/octet-stream';
        const byteString = atob(parts[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        blob = new Blob([ab], { type: mime });
      } else {
        const bom = options.bom || '';
        const mimeType = options.mimeType || 'text/plain';
        const charset = options.charset ? `;charset=${options.charset}` : '';
        
        blob = new Blob([bom + data], { 
          type: `${mimeType}${charset}` 
        });
      }
    } else {
      throw new Error('Unsupported data type for download');
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function downloadFileFromUrl(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJson(data: object, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, filename, {
    mimeType: 'application/json',
    charset: 'utf-8'
  });
}

export function downloadCsv(data: string[][], filename: string): void {
  const csvContent = data.map(row => 
    row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  downloadFile(csvContent, filename, {
    mimeType: 'text/csv',
    charset: 'utf-8',
    bom: '\uFEFF'
  });
}

export async function deleteDocument(
  documentId: string,
  options: {
    hardDelete?: boolean;
    confirm?: boolean;
    apiUrl?: string;
    authToken?: string;
  } = {}
): Promise<DeleteDocumentResponse> {
  const {
    hardDelete = false,
    confirm = true,
    apiUrl = '/api/documents',
    authToken
  } = options;

  try {
    if (confirm) {
      const userConfirmed = window.confirm(
        hardDelete 
          ? 'Are you sure you want to permanently delete this document? This action cannot be undone.'
          : 'Are you sure you want to move this document to trash?'
      );
      
      if (!userConfirmed) {
        return {
          success: false,
          message: 'Deletion cancelled by user'
        };
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${apiUrl}/${documentId}?hardDelete=${hardDelete}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
        code: 'HTTP_ERROR',
        status: response.status
      }));

      throw new Error(errorData.message || `Failed to delete document: ${response.statusText}`);
    }

    const result: DeleteDocumentResponse = await response.json();
    return result;

  } catch (error) {
    console.error('Error deleting document:', error);
    
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while deleting the document'
    );
  }
}

export async function softDeleteDocument(
  documentId: string,
  options: Omit<Parameters<typeof deleteDocument>[1], 'hardDelete'> = {}
): Promise<DeleteDocumentResponse> {
  return deleteDocument(documentId, { ...options, hardDelete: false });
}

export async function hardDeleteDocument(
  documentId: string,
  options: Omit<Parameters<typeof deleteDocument>[1], 'hardDelete'> = {}
): Promise<DeleteDocumentResponse> {
  return deleteDocument(documentId, { ...options, hardDelete: true });
}

export async function deleteDocuments(
  documentIds: string[],
  options: Parameters<typeof deleteDocument>[1] = {}
): Promise<DeleteDocumentResponse[]> {
  const results: DeleteDocumentResponse[] = [];
  
  for (const documentId of documentIds) {
    try {
      const result = await deleteDocument(documentId, {
        ...options,
        confirm: documentIds.length === 1 ? options.confirm : false
      });
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}