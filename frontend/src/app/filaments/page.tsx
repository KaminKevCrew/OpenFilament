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

interface Filament {
  id: number;
  name: string;
  brand: string;
  color: string;
  material: Material;
  diameter: number;
  price: number;
}

export default function FilamentsPage() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilaments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/filaments');
        if (!response.ok) {
          throw new Error('Failed to fetch filaments');
        }
        const data = await response.json();
        setFilaments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFilaments();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Filaments</h1>
          <Button asChild>
            <Link href="/filaments/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Filament
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">Loading filaments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Filaments</h1>
          <Button asChild>
            <Link href="/filaments/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Filament
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
        <h1 className="text-2xl font-bold">Filaments</h1>
        <Button asChild>
          <Link href="/filaments/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Filament
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Diameter (mm)</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filaments.map((filament) => (
              <TableRow key={filament.id}>
                <TableCell className="font-medium">{filament.name}</TableCell>
                <TableCell>{filament.brand}</TableCell>
                <TableCell>{filament.color}</TableCell>
                <TableCell>{filament.material.name}</TableCell>
                <TableCell>{filament.diameter}</TableCell>
                <TableCell>{filament.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" asChild>
                    <Link href={`/filaments/${filament.id}`}>Edit</Link>
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