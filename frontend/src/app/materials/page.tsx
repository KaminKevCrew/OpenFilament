'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Material {
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

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/materials');
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        setMaterials(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Materials</h1>
          <Button asChild>
            <Link href="/materials/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">Loading materials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Materials</h1>
          <Button asChild>
            <Link href="/materials/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Link>
          </Button>
        </div>
        <div className="text-center py-8 text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Materials</h1>
        <Button asChild>
          <Link href="/materials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Density (g/cm³)</TableHead>
              <TableHead>Softening Temp (°C)</TableHead>
              <TableHead>Idle Temp (°C)</TableHead>
              <TableHead>Min Temp (°C)</TableHead>
              <TableHead>Max Temp (°C)</TableHead>
              <TableHead>Shrinkage (%)</TableHead>
              <TableHead>Extrusion Ratio</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{material.density}</TableCell>
                <TableCell>{material.softening_temp}</TableCell>
                <TableCell>{material.idle_temp}</TableCell>
                <TableCell>{material.min_temp}</TableCell>
                <TableCell>{material.max_temp}</TableCell>
                <TableCell>{material.shrinkage}</TableCell>
                <TableCell>{material.extrusion_ratio}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" asChild>
                    <Link href={`/materials/${material.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 