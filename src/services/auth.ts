import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  ApiResponse 
} from '../types';
import { 
  apiPost, 
  apiGet, 
  setAuthToken, 
  setRefreshToken, 
  clearTokens 
} from './api';

export class AuthService {

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiPost<LoginResponse>('/auth/login', credentials);
    
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    
    return response;
  }


  static async register(userData: RegisterRequest): Promise<User> {
    const response = await apiPost<User>('/auth/register', userData);
    return response;
  }


  static async getCurrentUser(): Promise<User> {
    const response = await apiGet<User>('/auth/me');
    return response;
  }


  static async logout(): Promise<void> {
    try {
      await apiPost<ApiResponse>('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  }


  static async requestPasswordReset(email: string): Promise<ApiResponse> {
    const response = await apiPost<ApiResponse>('/auth/password-reset', {
      email,
    });
    return response;
  }


  static isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }


  static getUserRole(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }


  static hasRole(requiredRole: 'user' | 'manager' | 'admin'): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    const roleHierarchy = ['user', 'manager', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
  }
}