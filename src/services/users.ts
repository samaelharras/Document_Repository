import axios from 'axios';

class UsersService {
  async getUserProfile(): Promise<any> {
    const response = await axios.get('/api/users/profile');
    return response.data;
  }

  async updateUserProfile(data: any): Promise<any> {
    const response = await axios.put('/api/users/profile', data);
    return response.data;
  }

  async getAllUsers(): Promise<any[]> {
    const response = await axios.get('/api/users');
    return response.data;
  }
}

export const usersService = new UsersService();