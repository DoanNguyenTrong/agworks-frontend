import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { WorkType } from "@/lib/types";
import { X, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface WorkTypeFormProps {
  workType?: WorkType;
  onSubmit: (
    workType: Omit<WorkType, "_id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isView?: boolean;
}

export function WorkTypeForm({
  workType,
  onSubmit,
  onCancel,
  isEditing = false,
  isView = false,
}: WorkTypeFormProps) {
  const [formData, setFormData] = useState({
    name: workType?.name || "",
    description: workType?.description || "",
    category: workType?.category || "maintenance",
    paymentType: workType?.paymentType || "per_hour",
    baseRate: workType?.baseRate || 0,
    season: workType?.season || "year_round",
    skillLevel: workType?.skillLevel || "entry",
    equipment: workType?.equipment || [],
    isActive: workType?.isActive ?? true,
  });
  const { currentUser } = useAuth();

  const [newEquipment, setNewEquipment] = useState("");

  const handleEquipmentAdd = () => {
    if (
      newEquipment.trim() &&
      !formData.equipment.includes(newEquipment.trim())
    ) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, newEquipment.trim()],
      });
      setNewEquipment("");
    }
  };

  const handleEquipmentRemove = (equipment: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((e) => e !== equipment),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;
    onSubmit({
      ...formData,
      createdBy: currentUser?._id,
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "per_task":
        return "Per Task ($)";
      case "per_hour":
        return "Per Hour ($/hr)";
      case "per_acre":
        return "Per Acre ($/acre)";
      case "per_vine":
        return "Per Vine ($/vine)";
      default:
        return "Rate ($)";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing
            ? "Edit Work Type"
            : isView
            ? "Work Type Details"
            : "Create New Work Type"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update work type details and pricing"
            : isView
            ? "View work type details"
            : "Define a new work type for your vineyard operations"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Work Type Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Winter Pruning"
                required
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={isView}
              >
                <SelectTrigger disabled={isView}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pruning">Pruning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="harvest">Harvest</SelectItem>
                  <SelectItem value="planting">Planting</SelectItem>
                  <SelectItem value="spraying">Spraying</SelectItem>
                  <SelectItem value="cultivation">Cultivation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detailed description of the work type..."
              rows={3}
              required
              disabled={isView}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                value={formData.paymentType}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, paymentType: value })
                }
                disabled={isView}
              >
                <SelectTrigger disabled={isView}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_task">Per Task</SelectItem>
                  <SelectItem value="per_hour">Per Hour</SelectItem>
                  <SelectItem value="per_acre">Per Acre</SelectItem>
                  <SelectItem value="per_vine">Per Vine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseRate">
                {getPaymentTypeLabel(formData.paymentType)}
              </Label>
              <Input
                id="baseRate"
                type="number"
                step="0.01"
                min="0"
                value={formData.baseRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    baseRate: parseFloat(e.target.value) || 0,
                  })
                }
                required
                disabled={isView}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select
                value={formData.season}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, season: value })
                }
                disabled={isView}
              >
                <SelectTrigger disabled={isView}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="year_round">Year Round</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select
                value={formData.skillLevel}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, skillLevel: value })
                }
                disabled={isView}
              >
                <SelectTrigger disabled={isView}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Equipment Required</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Add equipment..."
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleEquipmentAdd())
                }
                disabled={isView}
              />
              <Button
                type="button"
                onClick={handleEquipmentAdd}
                size="sm"
                disabled={isView}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.equipment.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {item}
                  {!isView && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleEquipmentRemove(item)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
              disabled={isView}
            />
            <Label htmlFor="isActive">Work Type is active</Label>
          </div>

          <div className="flex gap-2 pt-4">
            {!isView && (
              <Button type="submit" className="flex-1">
                {isEditing ? "Update Work Type" : "Create Work Type"}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              {isView ? "Close" : "Cancel"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
