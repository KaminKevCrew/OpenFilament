import { auth } from './auth';

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
    const response = await auth.authenticatedRequest('/api/materials');
    return response.json();
  },

  async getFilaments(): Promise<Filament[]> {
    const response = await auth.authenticatedRequest('/api/filaments');
    return response.json();
  },

  async getSpools(): Promise<Spool[]> {
    const response = await auth.authenticatedRequest('/api/spools');
    return response.json();
  },
}; 