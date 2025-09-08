'use client';

import { useEffect, useState } from 'react';
import { spools } from '@/services/api';
import { AddSpoolModal } from '@/components/spools/add-spool-modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Spool } from '@/services/api';

export default function SpoolsPage() {
  const [spoolsList, setSpoolsList] = useState<Spool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpools() {
      try {
        const response = await spools.getAll();
        setSpoolsList(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch spools');
      } finally {
        setLoading(false);
      }
    }

    fetchSpools();
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
        <h1 className="text-2xl font-bold">Spools</h1>
        <AddSpoolModal />
      </div>
      <div className="grid gap-4">
        {spoolsList.map((spool) => (
          <Card key={spool.id}>
            <CardHeader>
              <CardTitle>{spool.filament.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Material:</span> {spool.filament.material.name}
                </div>
                <div>
                  <span className="font-medium">Diameter:</span> {spool.filament.diameter} mm
                </div>
                <div>
                  <span className="font-medium">Color:</span>
                  <div
                    className="inline-block w-4 h-4 rounded-full ml-2"
                    style={{ backgroundColor: spool.filament.color }}
                  />
                </div>
                <div>
                  <span className="font-medium">Starting Weight:</span> {spool.starting_weight} g
                </div>
                <div>
                  <span className="font-medium">Current Weight:</span> {spool.current_weight} g
                </div>
                <div>
                  <span className="font-medium">Starting Length:</span> {spool.starting_length} mm
                </div>
                <div>
                  <span className="font-medium">Current Length:</span> {spool.current_length} mm
                </div>
                <div>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={spool.is_active ? 'text-green-600' : 'text-red-600'}>
                    {spool.is_active ? 'Active' : 'Inactive'}
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