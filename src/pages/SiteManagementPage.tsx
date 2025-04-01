
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Search, Map, Edit, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sites, blocks, users } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function SiteManagementPage() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter sites by current customer
  const customerSites = sites.filter(site => 
    site.customerId === currentUser?.id &&
    (searchTerm === "" || 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      site.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout pageTitle="Site Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button asChild>
          <Link to="/customer/sites/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Site
          </Link>
        </Button>
      </div>
      
      {customerSites.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ? "No sites found" : "No Sites Added Yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 
              "Try adjusting your search." : 
              "Add your first vineyard site to get started."}
          </p>
          <Button asChild>
            <Link to="/customer/sites/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Site
            </Link>
          </Button>
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
                {customerSites.map((site) => {
                  // Get manager info
                  const manager = site.managerId ? 
                    users.find(user => user.id === site.managerId) : null;
                  
                  // Count blocks
                  const blockCount = blocks.filter(block => block.siteId === site.id).length;
                  
                  return (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell>{site.address}</TableCell>
                      <TableCell>
                        {manager ? (
                          <div className="flex items-center gap-2">
                            <span>{manager.name}</span>
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
                            <Link to={`/customer/sites/${site.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/customer/sites/edit/${site.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
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
    </MainLayout>
  );
}
