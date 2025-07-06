
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TreePine, Edit, Droplets, Home, MapPin } from "lucide-react";
import type { Block } from "@/lib/types";
import type { MapResource } from "@/pages/Map";

interface BlockInfoPanelProps {
  block: Block;
  resources: MapResource[];
  onEdit: () => void;
}

const getResourceIcon = (type: MapResource['type']) => {
  switch (type) {
    case 'water': return <Droplets className="h-4 w-4" />;
    case 'building': return <Home className="h-4 w-4" />;
    case 'equipment': return <TreePine className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

const getResourceColor = (type: MapResource['type']) => {
  switch (type) {
    case 'water': return 'bg-blue-100 text-blue-800';
    case 'building': return 'bg-gray-100 text-gray-800';
    case 'equipment': return 'bg-orange-100 text-orange-800';
    default: return 'bg-purple-100 text-purple-800';
  }
};

export function BlockInfoPanel({ block, resources, onEdit }: BlockInfoPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Block Details
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{block.name}</h3>
          <Badge variant="outline" className="mt-1">
            {block.acres} acres
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Rows:</span>
            <span className="font-medium">{block.rows}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vines:</span>
            <span className="font-medium">{block.vines.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vines per Row:</span>
            <span className="font-medium">{Math.round(block.vines / block.rows)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Resources:</span>
            <span className="font-medium">{resources.length}</span>
          </div>
        </div>

        {resources.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Block Resources</h4>
            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-2 p-2 rounded border"
                >
                  <div className={`p-1 rounded ${getResourceColor(resource.type)}`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{resource.name}</div>
                    <div className="text-xs text-gray-500">{resource.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
