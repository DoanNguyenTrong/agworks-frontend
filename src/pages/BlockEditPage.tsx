import { apiGetDetailBlock, apiUpdateBlock } from "@/api/block";
import { apiGetAllSite } from "@/api/site";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { get } from "lodash";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BlockEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [blockData, setBlockData] = useState<any>(null);
  const [availableSites, setAvailableSites] = useState<any>([]);

  // Form state
  const [name, setName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [acres, setAcres] = useState("");
  const [rows, setRows] = useState("");
  const [vines, setVines] = useState("");

  // Get sites for dropdown
  // const availableSites = sites;

  useEffect(() => {
    const getDetail = async (id: string) => {
      try {
        setIsLoading(true);
        const { data } = await apiGetDetailBlock(id);
        setBlockData(get(data, "metaData", {}));
        setName(get(data, "metaData.name", ""));
        setSiteId(get(data, "metaData.siteId._id", ""));
        setAcres(get(data, "metaData.acres", ""));
        setRows(get(data, "metaData.rows", ""));
        setVines(get(data, "metaData.vines", ""));
      } catch (error) {
        console.log("error :>> ", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDetail(id);
  }, [id]);

  useEffect(() => {
    const getAllSite = async () => {
      try {
        const { data } = await apiGetAllSite();
        const getBlockNoSite = get(data, "metaData", []).filter(
          (i: any) => !i?.siteId
        );
        // console.log("getBlockNoSite :>> ", getBlockNoSite);
        setAvailableSites(getBlockNoSite);
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    getAllSite();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    try {
      const newData = {
        ...blockData,
        name: name,
        siteId,
        acres,
        rows,
        vines,
      };
      await apiUpdateBlock(newData, id);
      toast({
        title: "Block updated",
        description: `${name} has been updated successfully.`,
      });
      navigate(`/customer/blocks/${id}`);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Edit Block">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!blockData) {
    return (
      <MainLayout pageTitle="Edit Block">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Block not found</p>
          <Button onClick={() => navigate("/customer/blocks")}>
            Back to Blocks
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Edit Block">
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate(`/customer/blocks/${id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Block Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Block</CardTitle>
          <CardDescription>
            Update information for {blockData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Block Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="site">Site</Label>
                <Select value={siteId} onValueChange={setSiteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSites.map((site) => (
                      <SelectItem key={site._id} value={site._id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="acres">Acres*</Label>
                  <Input
                    id="acres"
                    type="number"
                    step="0.1"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rows">Rows*</Label>
                  <Input
                    id="rows"
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="vines">Vines*</Label>
                  <Input
                    id="vines"
                    type="number"
                    value={vines}
                    onChange={(e) => setVines(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/customer/blocks/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
