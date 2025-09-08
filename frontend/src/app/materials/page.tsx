'use client';

import { useEffect, useState } from 'react';
import { materials } from '@/services/api';
import { AddMaterialModal } from '@/components/materials/add-material-modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/components';
import type { Material } from '@/services/api';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function MaterialsPage() {
  const [materialsList, setMaterialsList] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    async function fetchMaterials() {
      if (!isAuthenticated) return;

      try {
        const response = await materials.getAll();
        setMaterialsList(response);
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          logout();
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch materials');
        }
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchMaterials();
    }
  }, [isAuthenticated, isLoading, router, logout]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div>Loading materials...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materials</h1>
        <AddMaterialModal />
      </div>
      <div className="grid gap-4">
        {materialsList.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <CardTitle>{material.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{material.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Density:</span> {material.density} g/cm³
                </div>
                <div>
                  <span className="font-medium">Softening Temperature:</span> {material.softening_temp}°C
                </div>
                <div>
                  <span className="font-medium">Idle Temperature:</span> {material.idle_temp}°C
                </div>
                <div>
                  <span className="font-medium">Temperature Range:</span> {material.min_temp}°C - {material.max_temp}°C
                </div>
                <div>
                  <span className="font-medium">Shrinkage:</span> {material.shrinkage}%
                </div>
                <div>
                  <span className="font-medium">Extrusion Ratio:</span> {material.extrusion_ratio}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 