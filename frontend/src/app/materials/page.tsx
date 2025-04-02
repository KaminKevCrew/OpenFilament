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
import { api, Material } from '@/lib/api';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await api.getMaterials();
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Materials</CardTitle>
              <Button asChild>
                <Link href="/materials/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading materials...</div>
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
              <CardTitle>Materials</CardTitle>
              <Button asChild>
                <Link href="/materials/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
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
            <CardTitle>Materials</CardTitle>
            <Button asChild>
              <Link href="/materials/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Material
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
                  <TableHead>Density (g/cm³)</TableHead>
                  <TableHead>Softening Temp (°C)</TableHead>
                  <TableHead>Idle Temp (°C)</TableHead>
                  <TableHead>Min Temp (°C)</TableHead>
                  <TableHead>Max Temp (°C)</TableHead>
                  <TableHead>Shrinkage (%)</TableHead>
                  <TableHead>Extrusion Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>{material.density}</TableCell>
                    <TableCell>{material.softening_temp}</TableCell>
                    <TableCell>{material.idle_temp}</TableCell>
                    <TableCell>{material.min_temp}</TableCell>
                    <TableCell>{material.max_temp}</TableCell>
                    <TableCell>{material.shrinkage}</TableCell>
                    <TableCell>{material.extrusion_ratio}</TableCell>
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