import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon, Clock, ChevronDown, X } from "lucide-react";
import { sites, blocks, users } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { Block } from "@/lib/types";

// Work order schema - updated to include service companies
const workOrderSchema = z.object({
  siteId: z.string().min(1, "Site is required"),
  blockId: z.string().min(1, "Block is required"),  
  workDate: z.date({
    required_error: "Work date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  workType: z.enum(["pruning", "shootThinning", "other"], {
    required_error: "Work type is required",
  }),
  neededWorkers: z.coerce.number().min(1, "At least 1 worker is required"),
  payRate: z.coerce.number().min(0.01, "Pay rate must be greater than 0"),
  acres: z.coerce.number().optional(),
  rows: z.coerce.number().optional(),
  vines: z.coerce.number().optional(),
  vinesPerRow: z.coerce.number().optional(),
  notes: z.string().optional(),
  serviceCompanyIds: z.array(z.string()).min(1, "At least one service company must be selected"),
});

interface WorkOrderFormProps {
  onSubmit: (data: z.infer<typeof workOrderSchema>) => void;
  isSubmitting?: boolean;
}

export default function WorkOrderForm({ onSubmit, isSubmitting = false }: WorkOrderFormProps) {
  const { currentUser } = useAuth();
  const [managedSites, setManagedSites] = useState<any[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const [availableServiceCompanies, setAvailableServiceCompanies] = useState<any[]>([]);
  
  // Get sites managed by this manager and available service companies
  useEffect(() => {
    if (currentUser) {
      const userSites = sites.filter(site => site.managerId === currentUser.id);
      setManagedSites(userSites);
      
      // Get all service companies
      const serviceCompanies = users.filter(user => user.role === 'serviceCompany');
      setAvailableServiceCompanies(serviceCompanies);
    }
  }, [currentUser]);
  
  // Get form control
  const form = useForm<z.infer<typeof workOrderSchema>>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      siteId: "",
      blockId: "",
      workDate: new Date(),
      startTime: "08:00", 
      endTime: "17:00",
      workType: "pruning",
      neededWorkers: 1,
      payRate: 0.50,
      acres: undefined,
      rows: undefined,
      vines: undefined,
      vinesPerRow: undefined,
      notes: "",
      serviceCompanyIds: [],
    },
  });
  
  // Watch for siteId changes
  const selectedSiteId = form.watch("siteId");
  
  // Update available blocks when site changes
  useEffect(() => {
    if (selectedSiteId) {
      const siteBlocks = blocks.filter(block => block.siteId === selectedSiteId);
      setAvailableBlocks(siteBlocks);
      
      // Reset block selection if current selection is not in the new site
      const currentBlockId = form.getValues("blockId");
      if (currentBlockId && !siteBlocks.some(block => block.id === currentBlockId)) {
        form.setValue("blockId", "");
      }
    } else {
      setAvailableBlocks([]);
      form.setValue("blockId", "");
    }
  }, [selectedSiteId, form]);
  
  // Watch for blockId changes
  const selectedBlockId = form.watch("blockId");
  
  // Update block info when block changes
  useEffect(() => {
    if (selectedBlockId) {
      const selectedBlock = blocks.find(block => block.id === selectedBlockId);
      if (selectedBlock) {
        form.setValue("acres", selectedBlock.acres);
        form.setValue("rows", selectedBlock.rows);
        form.setValue("vines", selectedBlock.vines);
        
        if (selectedBlock.rows && selectedBlock.vines) {
          const vinesPerRow = Math.round(selectedBlock.vines / selectedBlock.rows);
          form.setValue("vinesPerRow", vinesPerRow);
        }
      }
    }
  }, [selectedBlockId, form]);
  
  const handleFormSubmit = (data: z.infer<typeof workOrderSchema>) => {
    onSubmit(data);
  };

  const selectedCompanyIds = form.watch("serviceCompanyIds");
  const selectedCompanies = availableServiceCompanies.filter(company => 
    selectedCompanyIds.includes(company.id)
  );

  const removeCompany = (companyId: string) => {
    const currentIds = form.getValues("serviceCompanyIds");
    form.setValue("serviceCompanyIds", currentIds.filter(id => id !== companyId));
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Selection */}
          <FormField
            control={form.control}
            name="siteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vineyard Site*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {managedSites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the vineyard site where work will be performed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Block Selection */}
          <FormField
            control={form.control}
            name="blockId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={availableBlocks.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={availableBlocks.length === 0 ? "Select a site first" : "Select block"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableBlocks.map(block => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the specific block within the vineyard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Service Company Selection - Dropdown */}
        <FormField
          control={form.control}
          name="serviceCompanyIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Service Companies*</FormLabel>
              <div className="space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedCompanies.length > 0 
                        ? `${selectedCompanies.length} companies selected`
                        : "Select service companies"
                      }
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96 max-h-64 overflow-y-auto bg-white">
                    {availableServiceCompanies.map((company) => (
                      <DropdownMenuCheckboxItem
                        key={company.id}
                        checked={field.value.includes(company.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, company.id]);
                          } else {
                            field.onChange(field.value.filter((id: string) => id !== company.id));
                          }
                        }}
                        className="flex flex-col items-start space-y-1 p-3"
                      >
                        <div className="font-medium">{company.companyName || company.name}</div>
                        <div className="text-sm text-muted-foreground">
                          📧 {company.email}
                        </div>
                        {company.address && (
                          <div className="text-sm text-muted-foreground">
                            📍 {company.address}
                          </div>
                        )}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Selected Companies Display */}
                {selectedCompanies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCompanies.map((company) => (
                      <Badge key={company.id} variant="secondary" className="flex items-center gap-1">
                        {company.companyName || company.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeCompany(company.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormDescription>
                Choose which service companies can bid on this work order.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Work Date */}
          <FormField
            control={form.control}
            name="workDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Work Date*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date when the work will be performed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Start Time */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time*</FormLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      {...field} 
                      type="time" 
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  When workers should start for the day.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* End Time */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time*</FormLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      {...field} 
                      type="time" 
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Expected end time for the day.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Work Type */}
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Type*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pruning">Pruning</SelectItem>
                    <SelectItem value="shootThinning">Shoot Thinning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of work to be performed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Needed Workers */}
          <FormField
            control={form.control}
            name="neededWorkers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Needed Workers*</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>
                  Number of workers needed for this job.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Pay Rate */}
          <FormField
            control={form.control}
            name="payRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Rate ($ per vine)*</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Payment rate per vine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Block Details */}
          <FormField
            control={form.control}
            name="acres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acres</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rows"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rows</FormLabel>
                <FormControl>
                  <Input type="number" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vines</FormLabel>
                <FormControl>
                  <Input type="number" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vinesPerRow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vines Per Row</FormLabel>
                <FormControl>
                  <Input type="number" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special instructions or notes for workers here..." 
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Work Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
