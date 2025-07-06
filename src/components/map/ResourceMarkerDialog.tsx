
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Site, Block } from "@/lib/types";
import type { MapResource } from "@/pages/Map";

interface ResourceMarkerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (resource: Omit<MapResource, "id">) => void;
  selectedSite: Site | null;
  selectedBlock: Block | null;
}

export function ResourceMarkerDialog({
  open,
  onClose,
  onSave,
  selectedSite,
  selectedBlock
}: ResourceMarkerDialogProps) {
  const [formData, setFormData] = useState({
    type: "water" as MapResource['type'],
    name: "",
    description: "",
    lat: 38.2975,
    lng: -122.4583
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite) return;

    onSave({
      ...formData,
      siteId: selectedSite.id,
      blockId: selectedBlock?.id
    });

    // Reset form
    setFormData({
      type: "water",
      name: "",
      description: "",
      lat: 38.2975,
      lng: -122.4583
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      type: "water",
      name: "",
      description: "",
      lat: 38.2975,
      lng: -122.4583
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Resource Marker</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Resource Type</Label>
            <Select value={formData.type} onValueChange={(value: MapResource['type']) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water">Water Source</SelectItem>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Resource name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Resource description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="0.000001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="0.000001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          {selectedSite && (
            <div className="text-sm text-gray-600">
              <p>Site: {selectedSite.name}</p>
              {selectedBlock && <p>Block: {selectedBlock.name}</p>}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Resource</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
