
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Plus, Droplets } from "lucide-react";
import type { MapMode } from "@/pages/Map";

interface MapToolbarProps {
  mode: MapMode;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddResource: () => void;
}

export function MapToolbar({ mode, onEdit, onSave, onCancel, onAddResource }: MapToolbarProps) {
  if (mode.type === "edit") {
    return (
      <div className="flex gap-2">
        <Button onClick={onSave} size="sm" className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-1" />
          Save Changes
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button onClick={onEdit} variant="outline" size="sm">
        <Edit className="h-4 w-4 mr-1" />
        Edit Blocks
      </Button>
      <Button onClick={onAddResource} variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Add Resource
      </Button>
    </div>
  );
}
