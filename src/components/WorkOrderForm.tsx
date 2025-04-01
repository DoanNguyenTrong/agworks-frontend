
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sites, blocks } from "@/lib/data";
import { Site, Block } from "@/lib/types";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const workOrderSchema = z.object({
  siteId: z.string().min(1, "Site is required"),
  blockId: z.string().min(1, "Block is required"),
  startDate: z.date({
    required_error: "Start date is required"
  }),
  endDate: z.date({
    required_error: "End date is required"
  }).refine(date => date > new Date(), {
    message: "End date must be in the future"
  }),
  workType: z.enum(["pruning", "shootThinning", "other"], {
    required_error: "Work type is required"
  }),
  neededWorkers: z.number().min(1, "At least 1 worker is required"),
  expectedHours: z.number().min(1, "Expected hours must be at least 1"),
  payRate: z.number().min(0.01, "Pay rate must be greater than 0"),
  acres: z.number().optional(),
  rows: z.number().optional(),
  vines: z.number().optional(),
  vinesPerRow: z.number().optional(), // Added this field to the schema
  notes: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export default function WorkOrderForm() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const { toast } = useToast();

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      siteId: "",
      blockId: "",
      workType: "pruning",
      neededWorkers: 1,
      expectedHours: 8,
      payRate: 0.75,
      acres: undefined,
      rows: undefined,
      vines: undefined,
      vinesPerRow: undefined,
      notes: "",
    },
  });

  const handleSiteChange = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      setSelectedSite(site);
      const siteBlocks = blocks.filter(b => b.siteId === siteId);
      setAvailableBlocks(siteBlocks);
      form.setValue("siteId", siteId);
      form.setValue("blockId", "");
    }
  };

  const handleBlockChange = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      form.setValue("blockId", blockId);
      if (block.acres) form.setValue("acres", block.acres);
      if (block.rows) form.setValue("rows", block.rows);
      if (block.vines) form.setValue("vines", block.vines);
      
      // Calculate vines per row
      if (block.vines && block.rows && block.rows > 0) {
        const vinesPerRow = Math.round(block.vines / block.rows);
        form.setValue("vinesPerRow", vinesPerRow);
      }
    }
  };

  function onSubmit(data: WorkOrderFormValues) {
    toast({
      title: "Work Order Created",
      description: "The work order has been created successfully."
    });
    console.log(data);
    form.reset();
    setSelectedSite(null);
    setAvailableBlocks([]);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Selection */}
          <FormField
            control={form.control}
            name="siteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site *</FormLabel>
                <Select onValueChange={handleSiteChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {selectedSite?.address || "Select a site to view its address"}
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
                <FormLabel>Block *</FormLabel>
                <Select onValueChange={handleBlockChange} defaultValue={field.value} disabled={!selectedSite}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a block" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableBlocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a block within the chosen site
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a start date</span>
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date when work will begin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick an end date</span>
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
                      disabled={(date) => 
                        date < new Date() || 
                        (form.getValues("startDate") && date < form.getValues("startDate"))
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The expected completion date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Type */}
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Type *</FormLabel>
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
                  The type of work to be performed
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
                <FormLabel>Number of Workers Needed *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    min={1}
                  />
                </FormControl>
                <FormDescription>
                  How many workers are required for this job
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expected Hours */}
          <FormField
            control={form.control}
            name="expectedHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Hours *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    min={1}
                  />
                </FormControl>
                <FormDescription>
                  Total expected hours for the job
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
                <FormLabel>Pay Rate ($ per piece) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    min={0.01}
                  />
                </FormControl>
                <FormDescription>
                  Amount paid per piece/task completed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional Fields */}
          <FormField
            control={form.control}
            name="acres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acres</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    min={0}
                  />
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
                <FormLabel>Number of Rows</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    min={0}
                  />
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
                <FormLabel>Number of Vines</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Vines per Row (calculated field) */}
          <FormItem>
            <FormLabel>Vines per Row (Average)</FormLabel>
            <Input
              type="number"
              readOnly
              value={
                form.getValues("rows") && form.getValues("vines") && form.getValues("rows") > 0
                  ? Math.round(form.getValues("vines") / form.getValues("rows"))
                  : ""
              }
              className="bg-muted"
            />
            <FormDescription>
              Automatically calculated
            </FormDescription>
          </FormItem>
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
                  placeholder="Add any additional details or instructions here..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Create Work Order</Button>
        </div>
      </form>
    </Form>
  );
}
