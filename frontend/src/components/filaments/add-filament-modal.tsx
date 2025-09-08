'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { materials, filaments } from '@/services/api';

export function AddFilamentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materialsList, setMaterialsList] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await materials.getAll();
        setMaterialsList(response);
      } catch (err) {
        console.error('Failed to fetch materials:', err);
      }
    }
    if (open) {
      fetchMaterials();
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      material_id: parseInt(formData.get('material_id') as string),
      diameter: parseFloat(formData.get('diameter') as string),
      weight: parseFloat(formData.get('weight') as string),
      color: formData.get('color') as string,
      is_active: true,
    };

    try {
      await filaments.create(data);
      setOpen(false);
      // Refresh the page to show the new filament
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create filament');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Filament
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Filament</DialogTitle>
          <DialogDescription>
            Enter the details for your new filament spool.
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
              <Label htmlFor="material_id">Material</Label>
              <Select name="material_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  {materialsList.map((material) => (
                    <SelectItem key={material.id} value={material.id.toString()}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diameter">Diameter (mm)</Label>
              <Input id="diameter" name="diameter" type="number" step="0.01" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (g)</Label>
              <Input id="weight" name="weight" type="number" step="0.1" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" type="color" required />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 mb-4">{error}</div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Filament'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 