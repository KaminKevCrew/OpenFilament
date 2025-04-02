import { api as axiosApi } from '@/services/api';

export interface Material {
  id: number;
  name: string;
  density: number;
  softening_temp: number;
  idle_temp: number;
  min_temp: number;
  max_temp: number;
  shrinkage: number;
  extrusion_ratio: number;
}

export interface Filament {
  id: number;
  name: string;
  brand: string;
  color: string;
  material: Material;
  diameter: number;
  price: number;
}

export interface Spool {
  id: number;
  filament: Filament;
  starting_weight: number;
  starting_length: number;
  current_weight: number;
  current_length: number;
}

export const api = {
  async getMaterials(): Promise<Material[]> {
    const response = await axiosApi.get<Material[]>('/materials');
    return response.data;
  },

  async getFilaments(): Promise<Filament[]> {
    const response = await axiosApi.get<Filament[]>('/filaments');
    return response.data;
  },

  async getSpools(): Promise<Spool[]> {
    const response = await axiosApi.get<Spool[]>('/spools');
    return response.data;
  },
}; 