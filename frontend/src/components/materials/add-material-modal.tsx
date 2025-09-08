'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { materials } from '@/services/api';

export function AddMaterialModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      density: parseFloat(formData.get('density') as string),
      softening_temp: parseFloat(formData.get('softening_temp') as string),
      idle_temp: parseFloat(formData.get('idle_temp') as string),
      min_temp: parseFloat(formData.get('min_temp') as string),
      max_temp: parseFloat(formData.get('max_temp') as string),
      shrinkage: parseFloat(formData.get('shrinkage') as string),
      extrusion_ratio: parseFloat(formData.get('extrusion_ratio') as string),
    };

    try {
      await materials.create(data);
      setOpen(false);
      // Refresh the page to show the new material
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create material');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
          <DialogDescription>
            Enter the details for your new 3D printing material.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="density">Density (g/cm³)</Label>
              <Input id="density" name="density" type="number" step="0.01" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="softening_temp">Softening Temperature (°C)</Label>
              <Input id="softening_temp" name="softening_temp" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idle_temp">Idle Temperature (°C)</Label>
              <Input id="idle_temp" name="idle_temp" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="min_temp">Minimum Temperature (°C)</Label>
              <Input id="min_temp" name="min_temp" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_temp">Maximum Temperature (°C)</Label>
              <Input id="max_temp" name="max_temp" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shrinkage">Shrinkage (%)</Label>
              <Input id="shrinkage" name="shrinkage" type="number" step="0.01" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="extrusion_ratio">Extrusion Ratio</Label>
              <Input id="extrusion_ratio" name="extrusion_ratio" type="number" step="0.01" required />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 mb-4">{error}</div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Material'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 