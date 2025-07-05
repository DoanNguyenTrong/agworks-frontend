import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MainLayout from "@/components/MainLayout";
import { WorkTypeForm } from "@/components/WorkTypeForm";
import { workTypes } from "@/lib/data/workTypes";
import { WorkType } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAllWorkTypesByCreatedId,
  createWorkType,
  updateWorkType,
  deleteWorkType,
} from "@/api/workType";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  DollarSign,
  Clock,
  Users,
  Eye,
} from "lucide-react";

export default function WorkTypeManagement() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [workTypesList, setWorkTypesList] = useState<WorkType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingWorkType, setEditingWorkType] = useState<WorkType | null>(null);
  const [viewWorkType, setViewWorkType] = useState<WorkType | null>(null);

  useEffect(() => {
    getListWorkTypes();
  }, []);

  const getListWorkTypes = async () => {
    const data = await getAllWorkTypesByCreatedId({
      createdBy: currentUser._id,
    });
    setWorkTypesList(data.data.metaData);
  };

  const filteredWorkTypes = workTypesList.filter((workType) => {
    const matchesSearch =
      workType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workType.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || workType.category === categoryFilter;
    const matchesSeason =
      seasonFilter === "all" || workType.season === seasonFilter;
    const matchesSkill =
      skillFilter === "all" || workType.skillLevel === skillFilter;

    return matchesSearch && matchesCategory && matchesSeason && matchesSkill;
  });

  const handleCreateWorkType = async (
    workTypeData: Omit<WorkType, "id" | "createdAt" | "updatedAt">
  ) => {
    const newWorkType: WorkType = {
      ...workTypeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?._id,
    };

    const data = await createWorkType(newWorkType);
    const newWorkTypeAdded = data.data.metaData;
    setWorkTypesList([...workTypesList, newWorkTypeAdded]);
    setShowForm(false);
    toast({
      title: "Work Type created",
      description: `${newWorkType.name} has been added to your work type library.`,
    });
  };

  const handleEditWorkType = async (
    workTypeData: Omit<WorkType, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingWorkType) return;

    const updatedWorkType: WorkType = {
      ...workTypeData,
      createdAt: editingWorkType.createdAt,
      updatedAt: new Date().toISOString(),
      createdBy: editingWorkType.createdBy,
    };
    const data = await updateWorkType(editingWorkType._id, updatedWorkType);
    setWorkTypesList(
      workTypesList.map((workType) =>
        workType._id === editingWorkType._id ? data.data.metaData : workType
      )
    );
    setEditingWorkType(null);
    setShowForm(false);
    toast({
      title: "Work Type updated",
      description: `${updatedWorkType.name} has been updated successfully.`,
    });
  };

  const handleDeleteWorkType = async (workTypeId: string) => {
    const workType = workTypesList.find((t) => t._id === workTypeId);
    await deleteWorkType(workTypeId);
    setWorkTypesList(workTypesList.filter((t) => t._id !== workTypeId));
    toast({
      title: "Work Type deleted",
      description: `${workType?.name} has been removed from your work type library.`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      pruning: "bg-green-100 text-green-800",
      maintenance: "bg-blue-100 text-blue-800",
      harvest: "bg-orange-100 text-orange-800",
      planting: "bg-purple-100 text-purple-800",
      spraying: "bg-yellow-100 text-yellow-800",
      cultivation: "bg-brown-100 text-brown-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getSkillLevelColor = (level: string) => {
    const colors = {
      entry: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      expert: "bg-red-100 text-red-800",
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatPaymentType = (type: string) => {
    const types = {
      per_task: "Per Task",
      per_hour: "Per Hour",
      per_acre: "Per Acre",
      per_vine: "Per Vine",
    };
    return types[type as keyof typeof types] || type;
  };

  const formatRate = (rate: number, paymentType: string) => {
    const currency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    switch (paymentType) {
      case "per_task":
        return `${currency.format(rate)} /task`;
      case "per_hour":
        return `${currency.format(rate)}/hour`;
      case "per_acre":
        return `${currency.format(rate)}/acre`;
      case "per_vine":
        return `${currency.format(rate)}/vine`;
      default:
        return currency.format(rate);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setSeasonFilter("all");
    setSkillFilter("all");
  };

  return (
    <MainLayout pageTitle="Work Type Management">
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Manage your vineyard work types and pricing structure
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Work Type
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Work Types
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workTypesList.length}</div>
              <p className="text-xs text-muted-foreground">
                {workTypesList.filter((t) => t.isActive).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {(
                  workTypesList.reduce(
                    (sum, workType) => sum + workType.baseRate,
                    0
                  ) / workTypesList.length || 0
                ).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all payment types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(workTypesList.map((t) => t.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different work types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search work types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pruning">Pruning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="harvest">Harvest</SelectItem>
                  <SelectItem value="planting">Planting</SelectItem>
                  <SelectItem value="spraying">Spraying</SelectItem>
                  <SelectItem value="cultivation">Cultivation</SelectItem>
                </SelectContent>
              </Select>

              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="year_round">Year Round</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skill Levels</SelectItem>
                  <SelectItem value="entry">Entry</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Types List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Work Types ({filteredWorkTypes.length})
            </CardTitle>
            <CardDescription>
              Manage your vineyard work definitions and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkTypes.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {workTypesList.length === 0
                    ? "No work types created yet. Create your first work type to get started."
                    : "No work types match your current filters. Try adjusting your search criteria."}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Type Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkTypes.map((workType, index) => (
                      <TableRow
                        key={`${workType._id}-${index}`}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setViewWorkType(workType);
                          setShowForm(false);
                        }}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{workType.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {workType.description.length > 50
                                ? `${workType.description.substring(0, 50)}...`
                                : workType.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getCategoryColor(workType.category)}
                          >
                            {workType.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatRate(
                              workType.baseRate,
                              workType.paymentType
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {workType.season.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getSkillLevelColor(workType.skillLevel)}
                          >
                            {workType.skillLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              workType.isActive ? "default" : "secondary"
                            }
                          >
                            {workType.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingWorkType(workType);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWorkType(workType._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Type Form Dialog */}
        <Dialog
          open={showForm || !!viewWorkType}
          onOpenChange={(open) => {
            if (!open) {
              setShowForm(false);
              setEditingWorkType(null);
              setViewWorkType(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl">
            {viewWorkType || editingWorkType ? (
              <WorkTypeForm
                workType={viewWorkType || editingWorkType || undefined}
                onSubmit={
                  editingWorkType ? handleEditWorkType : handleCreateWorkType
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingWorkType(null);
                  setViewWorkType(null);
                }}
                isEditing={!!editingWorkType}
                isView={!!viewWorkType && !editingWorkType}
              />
            ) : (
              <WorkTypeForm
                onSubmit={handleCreateWorkType}
                onCancel={() => {
                  setShowForm(false);
                  setEditingWorkType(null);
                }}
                isEditing={false}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
