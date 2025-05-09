import { apiGetAllWorkOrder } from "@/api/workOrder";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { WorkOrder } from "@/lib/types";
import { MAP_ROLE } from "@/lib/utils/role";
import dayjs from "dayjs";
import { get } from "lodash";
import { PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function WorkOrderManagement() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tableData, setTableData] = useState<Array<WorkOrder>>([]);

  const getStatusBadge = (status: WorkOrder["status"]) => {
    switch (status) {
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      case "New":
        return <Badge variant="secondary">New</Badge>;
      case "InProgress":
        return <Badge>In Progress</Badge>;
      case "Completed":
        return <Badge className="bg-agworks-green">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/manager/orders/${orderId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiGetAllWorkOrder({});
        // console.log("data :>> ", data);
        setTableData(get(data, "metaData", []));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const filterDatatable = (
    searchTerm: string,
    statusFilter: string,
    data: Array<WorkOrder>
  ) => {
    let result = data;

    // Lọc theo searchTerm
    if (searchTerm !== "") {
      result = result.filter((workOrder: WorkOrder) =>
        workOrder.ID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo statusFilter
    if (statusFilter !== "all") {
      result = result.filter(
        (workOrder) =>
          workOrder.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return result;
  };

  return (
    <MainLayout pageTitle="Work Order Management">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="InProgress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {get(currentUser, "role") === MAP_ROLE.SITE_MANAGER && (
            <Button asChild>
              <Link to="/manager/orders/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Order
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Work Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pay Rate</TableHead>
              {get(currentUser, "role") === MAP_ROLE.SITE_MANAGER && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterDatatable(searchTerm, statusFilter, tableData).length > 0 ? (
              filterDatatable(searchTerm, statusFilter, tableData).map(
                (order: WorkOrder) => {
                  return (
                    <TableRow
                      key={order._id}
                      className="cursor-pointer"
                      onClick={() =>
                        get(currentUser, "role") === MAP_ROLE.SITE_MANAGER &&
                        handleOrderClick(order._id)
                      }
                    >
                      <TableCell className="font-medium">{order.ID}</TableCell>
                      <TableCell>
                        {get(order, "blockId.name", "Unknown Block")}
                      </TableCell>
                      <TableCell>
                        {order.workType.charAt(0).toUpperCase() +
                          order.workType.slice(1)}
                      </TableCell>
                      <TableCell>
                        {dayjs(order.startDate).format("YYYY/MM/DD HH:mm")} -{" "}
                        {dayjs(order.endDate).format("YYYY/MM/DD HH:mm")}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>${order.payRate.toFixed(2)}</TableCell>
                      {get(currentUser, "role") === MAP_ROLE.SITE_MANAGER && (
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/manager/orders/${order._id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No work orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}
