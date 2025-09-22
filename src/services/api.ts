import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem('refresh_token', token);
};

const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          setAuthToken(access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    const errorData = error.response.data as ApiResponse;
    throw new Error(errorData.message || 'An error occurred');
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error('An unexpected error occurred');
  }
};

export const apiGet = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.get<T>(url);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error as AxiosError);
    throw new Error('Unreachable');
  }
};

export const apiPost = async <T, D = any>(url: string, data?: D): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error as AxiosError);
    throw new Error('Unreachable');
  }
};

export const apiPut = async <T, D = any>(url: string, data?: D): Promise<T> => {
  try {
    const response = await api.put<T>(url, data);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error as AxiosError);
    throw new Error('Unreachable');
  }
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.delete<T>(url);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error as AxiosError);
    throw new Error('Unreachable');
  }
};

export const apiUpload = async <T>(
  url: string,
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
): Promise<T> => {
  try {
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error as AxiosError);
    throw new Error('Unreachable');
  }
};

export const apiDownload = async (url: string): Promise<Blob | undefined> => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    return undefined;
  }
};
export { 
  getAuthToken, 
  setAuthToken, 
  getRefreshToken, 
  setRefreshToken, 
  clearTokens 
};

export default api;