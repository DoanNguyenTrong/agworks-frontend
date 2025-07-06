
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Droplets, TreePine, Home } from "lucide-react";
import type { Site, Block } from "@/lib/types";
import type { MapResource } from "@/pages/Map";

interface SiteInfoPanelProps {
  site: Site;
  blocks: Block[];
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

export function SiteInfoPanel({ site, blocks, resources, onEdit }: SiteInfoPanelProps) {
  const totalAcres = blocks.reduce((sum, block) => sum + block.acres, 0);
  const totalVines = blocks.reduce((sum, block) => sum + block.vines, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Site Details
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{site.name}</h3>
          <p className="text-sm text-gray-600">{site.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Blocks:</span>
            <div className="font-medium">{blocks.length}</div>
          </div>
          <div>
            <span className="text-gray-500">Total Acres:</span>
            <div className="font-medium">{totalAcres.toFixed(1)}</div>
          </div>
          <div>
            <span className="text-gray-500">Total Vines:</span>
            <div className="font-medium">{totalVines.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-500">Resources:</span>
            <div className="font-medium">{resources.length}</div>
          </div>
        </div>

        {resources.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Resources</h4>
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
