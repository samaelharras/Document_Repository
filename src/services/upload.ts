import axios from 'axios';

class UploadService {
  async uploadDocument(formData: FormData): Promise<any> {
    const response = await axios.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const uploadService = new UploadService();