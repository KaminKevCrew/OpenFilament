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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/components';
import { api, Filament } from '@/lib/api';

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

export default function FilamentsPage() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilaments = async () => {
      try {
        const data = await api.getFilaments();
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filaments</CardTitle>
              <Button asChild>
                <Link href="/filaments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Filament
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading filaments...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filaments</CardTitle>
              <Button asChild>
                <Link href="/filaments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Filament
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-destructive">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filaments</CardTitle>
            <Button asChild>
              <Link href="/filaments/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Filament
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Diameter (mm)</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filaments.map((filament) => (
                  <TableRow key={filament.id}>
                    <TableCell>{filament.name}</TableCell>
                    <TableCell>{filament.brand}</TableCell>
                    <TableCell>{filament.color}</TableCell>
                    <TableCell>{filament.material.name}</TableCell>
                    <TableCell>{filament.diameter}</TableCell>
                    <TableCell>${filament.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 