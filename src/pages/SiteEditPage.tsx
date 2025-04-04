
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sites, users } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function SiteEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [managerId, setManagerId] = useState("");
  
  // Get site managers for dropdown
  const siteManagers = users.filter(user => user.role === "siteManager");
  
  useEffect(() => {
    if (!id) return;
    
    const site = sites.find(s => s.id === id);
    if (site) {
      setSiteData(site);
      setName(site.name);
      setAddress(site.address);
      setManagerId(site.managerId || "");
    }
    
    setIsLoading(false);
  }, [id]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call
    toast({
      title: "Site updated",
      description: `${name} has been updated successfully.`,
    });
    
    navigate(`/customer/sites/${id}`);
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
      <Button 
        variant="ghost" 
        className="p-0 mb-6"
        onClick={() => navigate(`/customer/sites/${id}`)}
      >
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
                <Select 
                  value={managerId} 
                  onValueChange={setManagerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No manager assigned</SelectItem>
                    {siteManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/customer/sites/${id}`)}
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
