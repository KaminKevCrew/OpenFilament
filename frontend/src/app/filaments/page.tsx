'use client';

import { useEffect, useState } from 'react';
import { filaments } from '@/services/api';
import { AddFilamentModal } from '@/components/filaments/add-filament-modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Filament } from '@/services/api';

export default function FilamentsPage() {
  const [filamentsList, setFilamentsList] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFilaments() {
      try {
        const response = await filaments.getAll();
        setFilamentsList(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch filaments');
      } finally {
        setLoading(false);
      }
    }

    fetchFilaments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Filaments</h1>
        <AddFilamentModal />
      </div>
      <div className="grid gap-4">
        {filamentsList.map((filament) => (
          <Card key={filament.id}>
            <CardHeader>
              <CardTitle>{filament.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{filament.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Material:</span> {filament.material.name}
                </div>
                <div>
                  <span className="font-medium">Diameter:</span> {filament.diameter} mm
                </div>
                <div>
                  <span className="font-medium">Color:</span>
                  <div
                    className="inline-block w-4 h-4 rounded-full ml-2"
                    style={{ backgroundColor: filament.color }}
                  />
                </div>
                <div>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={filament.is_active ? 'text-green-600' : 'text-red-600'}>
                    {filament.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 