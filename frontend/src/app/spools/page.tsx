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
import { api, Spool } from '@/lib/api';

export default function SpoolsPage() {
  const [spools, setSpools] = useState<Spool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpools = async () => {
      try {
        const data = await api.getSpools();
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Spools</CardTitle>
              <Button asChild>
                <Link href="/spools/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Spool
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading spools...</div>
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
              <CardTitle>Spools</CardTitle>
              <Button asChild>
                <Link href="/spools/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Spool
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
            <CardTitle>Spools</CardTitle>
            <Button asChild>
              <Link href="/spools/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Spool
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filament</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Starting Weight (g)</TableHead>
                  <TableHead>Current Weight (g)</TableHead>
                  <TableHead>Starting Length (m)</TableHead>
                  <TableHead>Current Length (m)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spools.map((spool) => (
                  <TableRow key={spool.id}>
                    <TableCell>{spool.filament.name}</TableCell>
                    <TableCell>{spool.filament.brand}</TableCell>
                    <TableCell>{spool.filament.color}</TableCell>
                    <TableCell>{spool.filament.material.name}</TableCell>
                    <TableCell>{spool.starting_weight}</TableCell>
                    <TableCell>{spool.current_weight}</TableCell>
                    <TableCell>{spool.starting_length}</TableCell>
                    <TableCell>{spool.current_length}</TableCell>
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