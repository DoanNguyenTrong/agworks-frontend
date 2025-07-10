import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Grape, Rows, Map as MapIcon, Plus, Search, Edit, Eye, Trash, LayoutGrid, List, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addBlock } from "@/lib/utils/dataManagement";
import { MapView } from "@/components/map/MapView";
import { SiteInfoPanel } from "@/components/map/SiteInfoPanel";
import { BlockInfoPanel } from "@/components/map/BlockInfoPanel";
import { MapToolbar } from "@/components/map/MapToolbar";
import { ResourceMarkerDialog } from "@/components/map/ResourceMarkerDialog";
import type { Site, Block } from "@/lib/types";
import { get, join } from "lodash";
import { apiGetAllAccOrganization } from "@/api/account";
import { apiDeleteSite, apiGetListSite, apiGetAllSite } from "@/api/site";
import { apiCreateBlock, apiGetListBlock, apiDeleteBlock } from "@/api/block";
import { PERMISSION_EMPLOYEE, isPermissionCustomerOrEmployee } from "@/lib/utils/role";

// Map related interfaces
export interface MapResource {
  id: string;
  type: "water" | "building" | "equipment" | "other";
  name: string;
  description: string;
  lat: number;
  lng: number;
  siteId: string;
  blockId?: string;
}

export interface MapMode {
  type: "view" | "edit" | "addResource";
  selectedSite?: Site;
  selectedBlock?: Block;
  selectedResource?: MapResource;
}

// Form schema for blocks only
const blockFormSchema = z.object({
  name: z.string().min(2, {
    message: "Block name must be at least 2 characters.",
  }),
  siteId: z.string().min(1, {
    message: "Please select a site.",
  }),
  acres: z.coerce.number().optional(),
  rows: z.coerce.number().int().optional(),
  vines: z.coerce.number().int().optional(),
});

export default function UnifiedSiteManagement() {
  const { currentUser, permissions } = useAuth();
  const navigate = useNavigate();

  // Common state
  const [customerSites, setCustomerSites] = useState([]);

  // Sites tab state
  const [sitesSearchTerm, setSitesSearchTerm] = useState("");
  const [sitesViewMode, setSitesViewMode] = useState<"card" | "list">("card");

  // Blocks tab state
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blocksSearchTerm, setBlocksSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [blocksViewMode, setBlocksViewMode] = useState<"card" | "list">("card");
  const [customerBlocks, setCustomerBlocks] = useState<Array<Block>>([]);

  const [managers, setManagers] = useState<Array<any>>([]);

  // Map tab state
  const [mapMode, setMapMode] = useState<MapMode>({ type: "view" });
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [mapSiteFilter, setMapSiteFilter] = useState<string>("all");
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [resources, setResources] = useState<MapResource[]>([
    {
      id: "resource-1",
      type: "water",
      name: "Main Water Source",
      description: "Primary irrigation water source",
      lat: 38.2975,
      lng: -122.4583,
      siteId: "site-1"
    },
    {
      id: "resource-2",
      type: "building",
      name: "Equipment Shed",
      description: "Storage for farming equipment",
      lat: 38.2985,
      lng: -122.4593,
      siteId: "site-1",
      blockId: "block-1"
    }
  ]);

  // Filter blocks for current customer
  const siteIds = customerSites.map(site => site._id);
  let filteredBlocks = customerBlocks;

  // Apply site filter for blocks
  if (siteFilter !== "all") {
    filteredBlocks = filteredBlocks.filter(block => block.siteId && block.siteId._id === siteFilter);
  }

  // Apply search filter for blocks
  if (blocksSearchTerm) {
    filteredBlocks = filteredBlocks.filter(block =>
      block.name.toLowerCase().includes(blocksSearchTerm.toLowerCase())
    );
  }

  // Filter sites for search
  const filteredSites = customerSites.filter(site =>
    sitesSearchTerm === "" ||
    site.name.toLowerCase().includes(sitesSearchTerm.toLowerCase()) ||
    site.address.toLowerCase().includes(sitesSearchTerm.toLowerCase())
  );

  // Filter sites and blocks for map based on dropdown selection
  const mapFilteredSites = mapSiteFilter === "all" ? customerSites : customerSites.filter(site => site._id === mapSiteFilter);
  const mapFilteredBlocks = mapSiteFilter === "all" ? customerBlocks : customerBlocks.filter(block => block.siteId && block.siteId._id === mapSiteFilter);

  // Block form only
  const blockForm = useForm<z.infer<typeof blockFormSchema>>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      name: "",
      siteId: "",
      acres: undefined,
      rows: undefined,
      vines: undefined,
    },
  });

  // Block handlers
  const onBlockSubmit = async (values: z.infer<typeof blockFormSchema>) => {
    // In a real app, this would create a new block via API
    try {
      await apiCreateBlock(values);
      toast({
        title: "Block created",
        description: `"${values.name}" has been added to your vineyard.`,
      });
      fetchDataListBlock();
      setIsBlockDialogOpen(false);
      blockForm.reset();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  const handleDeleteBlock = async (blockToDelete: Block) => {
    if (!blockToDelete) return;
    try {
      await apiDeleteBlock(blockToDelete._id);
      toast({
        title: "Block deleted",
        description: `${blockToDelete.name} has been deleted.`,
      });
      fetchDataListBlock();
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  // Map handlers
  const handleSiteSelect = (site: Site) => {
    setSelectedSite(site);
    setSelectedBlock(null);
    setMapMode({ type: "view", selectedSite: site });
  };

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
    const site = customerSites.find(s => s._id === block.siteId);
    if (site) setSelectedSite(site);
  };

  const handleAddResource = (resource: Omit<MapResource, "id">) => {
    const newResource: MapResource = {
      ...resource,
      id: `resource-${Date.now()}`
    };
    setResources([...resources, newResource]);
    setShowResourceDialog(false);
  };

  const handleEditMode = () => {
    setMapMode({ type: "edit", selectedSite, selectedBlock });
  };

  const handleSaveChanges = () => {
    console.log("Saving map changes...");
    setMapMode({ type: "view" });
  };

  const handleCancelEdit = () => {
    setMapMode({ type: "view" });
  };

  // const siteBlocks = selectedSite ? blocks.filter(block => block.siteId === selectedSite._id) : [];
  // const siteResources = selectedSite ? resources.filter(resource => resource.siteId === selectedSite._id) : [];

  const getManagerName = (siteId: Array<any>) => {
    if (siteId.length <= 0) return "Unassigned";
    return managers.length > 0
      ? join(
        siteId.map((i) => i.name),
        ", "
      )
      : "Unknown Manager";
  };

  const handleDeleteSite = async (site: Site) => {
    if (!site._id) return;
    try {
      await apiDeleteSite(site._id);
      await fetchDataListSites();
      toast({
        title: "Site deleted",
        description: `"${site.name}" has been removed from your vineyard.`,
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  // Site Card Component
  const SiteCard = ({ site }: { site: Site }) => {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={() => navigate(`/${currentUser.role.toLowerCase()}/sites/${site._id}`)}>
        <CardHeader>
          <CardTitle>{site.name}</CardTitle>
          <CardDescription>Site ID: {site._id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{site.address}</p>
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Site Manager</p>
              <p className="text-sm text-muted-foreground">{getManagerName(site.userIds)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between" onClick={e => e.stopPropagation()}>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link
                to={`/${currentUser.role.toLowerCase()}/sites/${site._id}`}
              >
                View
              </Link>
            </Button>
            {
              isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link
                  to={`/${currentUser.role.toLowerCase()}/sites/edit/${site._id}`}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            }
          </div>
          {
            isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Site</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{site.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteSite(site)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }
        </CardFooter>
      </Card>
    );
  };

  // Block Card Component
  const BlockCard = ({ block }: { block: Block }) => {
    const site = customerSites.find(s => s._id === block.siteId);

    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={() => navigate(`/${currentUser.role.toLowerCase()}/blocks/${block._id}`)}>
        <CardHeader>
          <CardTitle>{block.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {get(block, "siteId.name", "Unknown Site")}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                {block.acres ? `${block.acres} acres` : "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <Rows className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                {block.rows ? `${block.rows} rows` : "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <Grape className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                {block.vines ? `${block.vines} vines` : "N/A"}
              </span>
            </div>
          </div>
          {block.rows && block.vines && block.rows > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Vines per Row: </span>
              <span>{Math.round(block.vines / block.rows)}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between" onClick={e => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => navigate(`/${currentUser.role.toLowerCase()}/blocks/edit/${block._id}`)}>Edit</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-500">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Block</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{block.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteBlock(block)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    );
  };

  useEffect(() => {
    getSiteManager();
    fetchDataListSites();
  }, []);

  const getSiteManager = async () => {
    try {
      const { data } = await apiGetAllAccOrganization();
      setManagers(get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const fetchDataListSites = async () => {
    try {
      const { data } = await apiGetListSite({});
      setCustomerSites(get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchDataListBlock();
  }, []);

  const fetchDataListBlock = async () => {
    try {
      const { data } = await apiGetListBlock({});
      setCustomerBlocks(get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <MainLayout pageTitle="Sites Management">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Sites
          </TabsTrigger>
          <TabsTrigger value="blocks" className="flex items-center gap-2">
            <Grape className="h-4 w-4" />
            Blocks
          </TabsTrigger>
        </TabsList>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <div className="h-[calc(100vh-200px)] flex gap-4">
            {/* Left Sidebar */}
            <div className="w-80 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Sites & Blocks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Site Filter Dropdown */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">View Sites</label>
                    <Select value={mapSiteFilter} onValueChange={setMapSiteFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sites to view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sites</SelectItem>
                        {customerSites.map((site, index) => (
                          <SelectItem key={`${site._id}-${index}`} value={site._id}>{site.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sites List */}
                  <div className="space-y-3">
                    {mapFilteredSites.map((site, index) => {
                      const siteBlocks = mapFilteredBlocks.filter(block => block.siteId && block.siteId._id === site._id);
                      return (
                        <div key={`${site._id}-${index}`} className="space-y-2">
                          <div
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedSite?._id === site._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => handleSiteSelect(site)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{site.name}</h4>
                                <p className="text-sm text-gray-500">{site.address}</p>
                              </div>
                              <Badge variant="secondary">{siteBlocks.length} blocks</Badge>
                            </div>
                          </div>
                          {selectedSite?._id === site._id && (
                            <div className="ml-4 space-y-1">
                              {siteBlocks.map((block) => (
                                <div
                                  key={block._id}
                                  className={`p-2 rounded border cursor-pointer text-sm transition-colors ${selectedBlock?._id === block._id
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                  onClick={() => handleBlockSelect(block)}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{block.name}</span>
                                    <span className="text-gray-500">{block.acres} acres</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Site/Block Info Panel
              {selectedSite && (
                <SiteInfoPanel
                  site={selectedSite}
                  blocks={siteBlocks}
                  resources={siteResources}
                  onEdit={handleEditMode}
                />
              )}

              {selectedBlock && (
                <BlockInfoPanel
                  block={selectedBlock}
                  resources={siteResources.filter(r => r.blockId === selectedBlock._id)}
                  onEdit={handleEditMode}
                />
              )} */}
            </div>

            {/* Main Map Area */}
            <div className="flex-1 relative">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Vineyard Map</CardTitle>
                    {/* <MapToolbar
                      mode={mapMode}
                      onEdit={handleEditMode}
                      onSave={handleSaveChanges}
                      onCancel={handleCancelEdit}
                      onAddResource={() => setShowResourceDialog(true)}
                    /> */}
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)] p-0">
                  <MapView
                    sites={mapFilteredSites}
                    blocks={mapFilteredBlocks}
                    resources={resources}
                    selectedSite={selectedSite}
                    selectedBlock={selectedBlock}
                    mode={mapMode}
                    onSiteSelect={handleSiteSelect}
                    onBlockSelect={handleBlockSelect}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <ResourceMarkerDialog
            open={showResourceDialog}
            onClose={() => setShowResourceDialog(false)}
            onSave={handleAddResource}
            selectedSite={selectedSite}
            selectedBlock={selectedBlock}
          />
        </TabsContent>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites..."
                  value={sitesSearchTerm}
                  onChange={(e) => setSitesSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              {
                isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                <Button onClick={() => navigate(`/${currentUser.role.toLowerCase()}/sites/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Site
                </Button>
              }

              <ToggleGroup type="single" value={sitesViewMode} onValueChange={(value) => value && setSitesViewMode(value as "card" | "list")}>
                <ToggleGroupItem value="card" aria-label="Card view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {filteredSites.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {sitesSearchTerm ? "No sites found" : "No Sites Added Yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {sitesSearchTerm ?
                  "Try adjusting your search." :
                  "Add your first vineyard site to get started."}
              </p>
              {
                isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                <Button onClick={() => navigate(`/${currentUser.role.toLowerCase()}/sites/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Site
                </Button>
              }
            </div>
          ) : sitesViewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map((site, index) => (
                <SiteCard key={`${site._id}-${index}`} site={site} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Blocks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSites.map((site) => {
                      const blockCount = customerBlocks.filter(block => block.siteId && block.siteId._id === site._id).length;

                      return (
                        <TableRow key={site._id}>
                          <TableCell className="font-medium">{site.name}</TableCell>
                          <TableCell>{site.address}</TableCell>
                          <TableCell>
                            {site.userIds ? (
                              <div className="flex items-center gap-2">
                                {getManagerName(site.userIds)}
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{blockCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/${currentUser.role.toLowerCase()}/sites/${site._id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              {
                                isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                                <Button variant="ghost" size="icon" asChild>
                                  <Link to={`/${currentUser.role.toLowerCase()}/sites/edit/${site._id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                              }
                              {
                                isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete {site.name} and all associated blocks.
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSite(site)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Blocks Tab */}
        <TabsContent value="blocks" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blocks..."
                  value={blocksSearchTerm}
                  onChange={(e) => setBlocksSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {customerSites.map((site, index) => (
                    <SelectItem key={`${site._id}-${index}`} value={site._id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              {
                isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Block
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Vineyard Block</DialogTitle>
                      <DialogDescription>
                        Enter the details of your new vineyard block.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...blockForm}>
                      <form onSubmit={blockForm.handleSubmit(onBlockSubmit)} className="space-y-6">
                        <FormField
                          control={blockForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Block Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Block A - Cabernet" {...field} />
                              </FormControl>
                              <FormDescription>
                                A descriptive name for this vineyard block
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={blockForm.control}
                          name="siteId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Site</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a site" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {customerSites.map(site => (
                                    <SelectItem key={site._id} value={site._id}>
                                      {site.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The vineyard site where this block is located
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={blockForm.control}
                            name="acres"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Acres</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="5.2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={blockForm.control}
                            name="rows"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rows</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="120" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={blockForm.control}
                            name="vines"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vines</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="3600" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <DialogFooter>
                          <Button type="submit">Create Block</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              }
              <ToggleGroup type="single" value={blocksViewMode} onValueChange={(value) => value && setBlocksViewMode(value as "card" | "list")}>
                <ToggleGroupItem value="card" aria-label="Card view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {filteredBlocks.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <Grape className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {blocksSearchTerm || siteFilter !== "all" ? "No blocks found" : "No Blocks Added Yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {blocksSearchTerm || siteFilter !== "all" ?
                  "Try adjusting your search or filter." :
                  "Add your first vineyard block to get started."}
              </p>
              {
                isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                <Button onClick={() => setIsBlockDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Block
                </Button>
              }
            </div>
          ) : blocksViewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlocks.map((block) => (
                <BlockCard key={block._id} block={block} />
              ))}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block Name</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Acres</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Vines</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlocks.map((block) => {
                    const site = customerSites.find(s => s._id === block.siteId);
                    return (
                      <TableRow key={block._id}>
                        <TableCell className="font-medium">{block.name}</TableCell>
                        <TableCell>{get(block, "siteId.name", "Unknown Site")}</TableCell>
                        <TableCell>{block.acres || "—"}</TableCell>
                        <TableCell>{block.rows || "—"}</TableCell>
                        <TableCell>{block.vines || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/${currentUser.role.toLowerCase()}/blocks/${block._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {
                              isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_SITES) &&
                              <>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link to={`/${currentUser.role.toLowerCase()}/blocks/edit/${block._id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete {block.name}.
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteBlock(block)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
