import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3001';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('authToken', token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('authToken');
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });

    const data = await this.handleResponse(response);
    
    if (data.data?.token) {
      await this.setToken(data.data.token);
    }

    return data;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse(response);
    
    if (data.data?.token) {
      await this.setToken(data.data.token);
    }

    return data;
  }

  async logout() {
    await this.clearToken();
  }

  async getProfile() {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Goals endpoints
  async getGoals() {
    const response = await fetch(`${API_URL}/api/goals`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createGoal(goal: {
    title: string;
    metric: string;
    deadline: string;
    category?: string;
    color?: string;
    why?: string;
  }) {
    const response = await fetch(`${API_URL}/api/goals`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(goal),
    });

    return this.handleResponse(response);
  }

  async updateGoal(id: string, updates: any) {
    const response = await fetch(`${API_URL}/api/goals/${id}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  async deleteGoal(id: string) {
    const response = await fetch(`${API_URL}/api/goals/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Actions endpoints
  async getDailyActions() {
    const response = await fetch(`${API_URL}/api/actions/daily`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createAction(action: {
    title: string;
    time?: string;
    goalId?: string;
  }) {
    const response = await fetch(`${API_URL}/api/actions`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(action),
    });

    return this.handleResponse(response);
  }

  async completeAction(id: string) {
    const response = await fetch(`${API_URL}/api/actions/${id}/complete`, {
      method: 'PUT',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Social endpoints
  async getFeed(type: 'circle' | 'follow' = 'circle') {
    const response = await fetch(`${API_URL}/api/feed/${type}`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createPost(post: {
    type: 'checkin' | 'status' | 'photo' | 'audio' | 'goal';
    visibility: 'circle' | 'follow' | 'public';
    content: string;
    mediaUrl?: string;
    actionTitle?: string;
    goalTitle?: string;
    goalColor?: string;
    streak?: number;
  }) {
    console.log('📤 Sending post to API:', post);
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(post),
    });

    return this.handleResponse(response);
  }

  async reactToPost(postId: string, emoji: string) {
    const response = await fetch(`${API_URL}/api/posts/${postId}/react`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ emoji }),
    });

    return this.handleResponse(response);
  }

  // Streaks endpoint
  async getStreaks() {
    const response = await fetch(`${API_URL}/api/streaks`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();