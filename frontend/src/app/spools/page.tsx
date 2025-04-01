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

interface Spool {
  id: number;
  filament: Filament;
  starting_weight: number;
  starting_length: number;
  current_weight: number;
  current_length: number;
}

export default function SpoolsPage() {
  const [spools, setSpools] = useState<Spool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpools = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/spools');
        if (!response.ok) {
          throw new Error('Failed to fetch spools');
        }
        const data = await response.json();
        setSpools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSpools();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Spools</h1>
          <Button asChild>
            <Link href="/spools/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Spool
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">Loading spools...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Spools</h1>
          <Button asChild>
            <Link href="/spools/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Spool
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
        <h1 className="text-2xl font-bold">Spools</h1>
        <Button asChild>
          <Link href="/spools/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Spool
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filament</TableHead>
              <TableHead>Starting Weight (g)</TableHead>
              <TableHead>Starting Length (m)</TableHead>
              <TableHead>Current Weight (g)</TableHead>
              <TableHead>Current Length (m)</TableHead>
              <TableHead>Remaining (%)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spools.map((spool) => (
              <TableRow key={spool.id}>
                <TableCell className="font-medium">
                  {spool.filament.name} ({spool.filament.brand} - {spool.filament.color})
                </TableCell>
                <TableCell>{spool.starting_weight.toFixed(1)}</TableCell>
                <TableCell>{spool.starting_length.toFixed(1)}</TableCell>
                <TableCell>{spool.current_weight.toFixed(1)}</TableCell>
                <TableCell>{spool.current_length.toFixed(1)}</TableCell>
                <TableCell>
                  {((spool.current_length / spool.starting_length) * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" asChild>
                    <Link href={`/spools/${spool.id}`}>Edit</Link>
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