import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Use environment variable if available, otherwise fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for our data models
export interface Material {
  id: number;
  name: string;
  description: string;
  density: number;
  softening_temp: number;
  idle_temp: number;
  min_temp: number;
  max_temp: number;
  shrinkage: number;
  extrusion_ratio: number;
  created_at: string;
  user_id: number;
}

export interface Filament {
  id: number;
  material_id: number;
  name: string;
  description: string;
  diameter: number;
  color: string;
  is_active: boolean;
  created_at: string;
  user_id: number;
  material: Material;
}

export interface Spool {
  id: number;
  filament_id: number;
  name: string;
  description: string;
  starting_weight: number;
  starting_length: number;
  current_weight: number;
  current_length: number;
  is_active: boolean;
  created_at: string;
  user_id: number;
  filament: Filament;
}

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token and log requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Add response interceptor to handle errors and log responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 401 || error.response?.status === 422) {
      // Clear token but don't redirect - let the components handle the redirect
      Cookies.remove('token');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      const { access_token } = response.data;
      // Set token with a longer expiration (30 days)
      Cookies.set('token', access_token, { expires: 30 }); // 30 days
      console.log('Login successful, token set, user:', response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting registration with:', { email, username });
      const response = await api.post<AuthResponse>('/auth/signup', { username, email, password });
      const { access_token } = response.data;
      // Set token with a longer expiration (30 days)
      Cookies.set('token', access_token, { expires: 30 }); // 30 days
      console.log('Registration successful, token set, user:', response.data.user);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: () => {
    console.log('Logging out, removing token');
    Cookies.remove('token');
  },
  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('Fetching current user');
      const response = await api.get<User>('/users/me');
      console.log('Current user fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to get user data');
      }
      throw new Error('Failed to get user data');
    }
  },
  getToken: (): string | undefined => {
    const token = Cookies.get('token');
    console.log('Getting token:', token ? 'Token exists' : 'No token');
    return token;
  },
};

// Materials endpoints
export const materials = {
  getAll: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/materials');
    return response.data;
  },
  getById: async (id: number): Promise<Material> => {
    const response = await api.get<Material>(`/materials/${id}`);
    return response.data;
  },
  create: async (data: Omit<Material, 'id' | 'created_at' | 'user_id'>): Promise<Material> => {
    const response = await api.post<Material>('/materials', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Material>): Promise<Material> => {
    const response = await api.put<Material>(`/materials/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/materials/${id}`);
  },
};

// Filaments endpoints
export const filaments = {
  getAll: async (): Promise<Filament[]> => {
    const response = await api.get<Filament[]>('/filaments');
    return response.data;
  },
  getById: async (id: number): Promise<Filament> => {
    const response = await api.get<Filament>(`/filaments/${id}`);
    return response.data;
  },
  create: async (data: Omit<Filament, 'id' | 'created_at' | 'user_id' | 'material'>): Promise<Filament> => {
    const response = await api.post<Filament>('/filaments', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Filament>): Promise<Filament> => {
    const response = await api.put<Filament>(`/filaments/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/filaments/${id}`);
  },
};

// Spools endpoints
export const spools = {
  getAll: async (): Promise<Spool[]> => {
    const response = await api.get<Spool[]>('/spools');
    return response.data;
  },
  getById: async (id: number): Promise<Spool> => {
    const response = await api.get<Spool>(`/spools/${id}`);
    return response.data;
  },
  create: async (data: Omit<Spool, 'id' | 'created_at' | 'user_id' | 'filament'>): Promise<Spool> => {
    const response = await api.post<Spool>('/spools', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Spool>): Promise<Spool> => {
    const response = await api.put<Spool>(`/spools/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/spools/${id}`);
  },
}; 