import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for our data models
interface Material {
  id: number;
  name: string;
  description: string;
  created_at: string;
  user_id: number;
}

interface Filament {
  id: number;
  material_id: number;
  name: string;
  description: string;
  diameter: number;
  created_at: string;
  user_id: number;
  material: Material;
}

interface Spool {
  id: number;
  filament_id: number;
  starting_weight: number;
  starting_length: number;
  current_weight: number;
  current_length: number;
  created_at: string;
  user_id: number;
  filament: Filament;
}

interface User {
  id: number;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      Cookies.remove('token');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token } = response.data;
    Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
    return response.data;
  },
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', { username, email, password });
    const { token } = response.data;
    Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
    return response.data;
  },
  logout: () => {
    Cookies.remove('token');
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
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