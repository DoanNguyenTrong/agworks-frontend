import { apiGetAccList } from "@/api/account";
import { apiGetDetailSite, apiUpdateSite } from "@/api/site";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { get, uniq } from "lodash";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SiteEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState<any>(null);
  const [siteManagers, setSiteManagers] = useState<Array<User>>([]);
  const [curentManager, setCurentManager] = useState<Array<User>>([]);

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [managerId, setManagerId] = useState("");

  useEffect(() => {
    const getSiteManager = async () => {
      try {
        // const { data } = await apiGetAllAccOrganization();
        // // console.log("apiGetAllAccOrganization :>> ", data);
        // setSiteManagers(get(data, "metaData", []));

        //get manager list in current organazation
        const { data } = await apiGetAccList({
          filter: {
            role: "SiteManager",
            organizationId: siteData.organizationId,
          },
        });

        setSiteManagers(get(data, "metaData", []));
      } catch (error) {
        console.log("error :>> ", error);
      }
    };
    getSiteManager();
  }, [siteData]);

  useEffect(() => {
    const getDetail = async (id: string) => {
      try {
        setIsLoading(true);
        const { data } = await apiGetDetailSite(id);
        setSiteData(get(data, "metaData", {}));
        setName(get(data, "metaData.name", ""));
        setAddress(get(data, "metaData.address", ""));
        setCurentManager(get(data, "metaData.userIds", ""));
        // setManagerId(get(data, "metaData.userIds", ""));
      } catch (error) {
        console.log("error :>> ", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDetail(id);
    setIsLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    try {
      const { userIds, ...cloneSiteData } = siteData;
      const newData = {
        ...cloneSiteData,
        name: name.trim(),
        address: address.trim(),
        userId: uniq([
          ...curentManager.map((i: any) => i._id),
          managerId,
        ]).filter((item) => item !== ""),
      };
      await apiUpdateSite(newData, id);
      toast({
        title: "Site updated",
        description: `${name} has been updated successfully.`,
      });
      navigate(-1);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Edit Site">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!siteData) {
    return (
      <MainLayout pageTitle="Edit Site">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Site not found</p>
          <Button onClick={() => navigate("/customer/sites")}>
            Back to Sites
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Edit Site">
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Site Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Site</CardTitle>
          <CardDescription>
            Update information for {siteData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="manager">Site Manager</Label>
                <Select value={managerId} onValueChange={setManagerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="none">None</SelectItem> */}
                    {siteManagers
                      .filter(
                        (manager: User) =>
                          !curentManager.some(
                            (selected: User) => selected._id === manager._id
                          )
                      )
                      .map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="py-4 text-[14px] flex justify-start items-center gap-2">
                  <div>Site Manager selected:</div>
                  {curentManager.map((i: User, idx) => (
                    <div
                      key={i._id}
                      onDoubleClick={() =>
                        setCurentManager(
                          curentManager.filter((u: User) => u._id !== i._id)
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <div className="bg-blue-200 hover:bg-red-500 px-5 py-1 rounded-full font-bold cursor-pointer delete-user">
                        <div className="name">{i.name}</div>
                        <div className="des hidden text-[#FFF]">Xóa</div>
                      </div>
                      {idx < curentManager.length - 1 && <>,</>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
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
