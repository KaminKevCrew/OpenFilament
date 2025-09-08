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
import { filaments, spools } from '@/services/api';

export function AddSpoolModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filamentsList, setFilamentsList] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    async function fetchFilaments() {
      try {
        const response = await filaments.getAll();
        setFilamentsList(response);
      } catch (err) {
        console.error('Failed to fetch filaments:', err);
      }
    }
    if (open) {
      fetchFilaments();
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const startingWeight = parseFloat(formData.get('starting_weight') as string);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      filament_id: parseInt(formData.get('filament_id') as string),
      starting_weight: startingWeight,
      starting_length: parseFloat(formData.get('starting_length') as string),
      current_weight: startingWeight,
      current_length: parseFloat(formData.get('starting_length') as string),
      is_active: true,
    };

    try {
      await spools.create(data);
      setOpen(false);
      // Refresh the page to show the new spool
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create spool');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Spool
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Spool</DialogTitle>
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
              <Label htmlFor="filament_id">Filament</Label>
              <Select name="filament_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a filament" />
                </SelectTrigger>
                <SelectContent>
                  {filamentsList.map((filament) => (
                    <SelectItem key={filament.id} value={filament.id.toString()}>
                      {filament.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="starting_weight">Starting Weight (g)</Label>
              <Input id="starting_weight" name="starting_weight" type="number" step="0.1" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="starting_length">Starting Length (mm)</Label>
              <Input id="starting_length" name="starting_length" type="number" step="0.1" required />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 mb-4">{error}</div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Spool'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 