import { apiGetBlockByFiled } from "@/api/block";
import { apiGetSearchSiteByUser } from "@/api/site";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Block } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import dayjs from "dayjs";
import { get, isEmpty } from "lodash";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Work order schema
const workOrderSchema = z.object({
  siteId: z.string().min(1, "Site is required"),
  blockId: z.string().min(1, "Block is required"),
  workDate: z.date({
    required_error: "Work date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  workType: z.enum(["pruning", "shoot_thinning", "other"], {
    required_error: "Work type is required",
  }),
  neededWorkers: z.coerce.number().min(1, "At least 1 worker is required"),
  payRate: z.coerce.number().min(0.01, "Pay rate must be greater than 0"),
  acres: z.coerce.number().optional(),
  rows: z.coerce.number().optional(),
  vines: z.coerce.number().optional(),
  vinesPerRow: z.coerce.number().optional(),
  notes: z.string().optional(),
});

interface WorkOrderFormProps {
  onSubmit: (data: z.infer<typeof workOrderSchema>) => void;
  isSubmitting?: boolean;
  initForm?: any;
}

export default function WorkOrderForm({
  onSubmit,
  isSubmitting = false,
  initForm = {},
}: WorkOrderFormProps) {
  const { currentUser } = useAuth();
  const [managedSites, setManagedSites] = useState<any[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const { toast } = useToast();

  // Get sites managed by this manager
  useEffect(() => {
    const getAllSite = async () => {
      try {
        const res = await apiGetSearchSiteByUser();
        // console.log("data :>> ", res);
        setManagedSites(get(res, "data", []));
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    getAllSite();
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
      workType: undefined,
      neededWorkers: undefined,
      payRate: undefined,
      acres: undefined,
      rows: undefined,
      vines: undefined,
      vinesPerRow: undefined,
      notes: "",
    },
  });

  // Watch for siteId changes
  const selectedSiteId = form.watch("siteId");

  // Update available blocks when site changes
  useEffect(() => {
    const getDataBlock = async () => {
      if (selectedSiteId) {
        let siteBlocks = [];
        try {
          const { data } = await apiGetBlockByFiled({
            siteId: selectedSiteId,
          });
          siteBlocks = get(data, "metaData", []);
        } catch (error) {
          console.log("error :>> ", error);
        }
        setAvailableBlocks(siteBlocks);
      } else {
        setAvailableBlocks([]);
      }
      if (isEmpty(initForm)) {
        form.setValue("blockId", undefined);
      } else {
        form.setValue("blockId", get(initForm, "blockId._id"));
      }
      form.setValue("acres", undefined);
      form.setValue("rows", undefined);
      form.setValue("vines", undefined);
      form.setValue("vinesPerRow", undefined);
    };

    getDataBlock();
  }, [selectedSiteId, form]);

  // Watch for blockId changes
  const selectedBlockId = form.watch("blockId");

  // Update block info when block changes
  useEffect(() => {
    if (selectedBlockId) {
      if (
        !isEmpty(initForm) &&
        selectedBlockId === get(initForm, "blockId._id")
      ) {
        form.setValue("blockId", get(initForm, "blockId._id"));
      }
      const selectedBlock = availableBlocks.find(
        (block) => block._id === selectedBlockId
      );
      if (selectedBlock) {
        form.setValue("acres", selectedBlock.acres);
        form.setValue("rows", selectedBlock.rows);
        form.setValue("vines", selectedBlock.vines);

        if (selectedBlock.rows && selectedBlock.vines) {
          const vinesPerRow = Math.round(
            selectedBlock.vines / selectedBlock.rows
          );
          form.setValue("vinesPerRow", vinesPerRow);
        }
      } else {
        form.setValue("acres", undefined);
        form.setValue("rows", undefined);
        form.setValue("vines", undefined);
        form.setValue("vinesPerRow", undefined);
      }
    }
  }, [selectedBlockId, form]);

  const convertToStartEnd = (
    workDate: any,
    startTime: string,
    endTime: string
  ) => {
    // Parse workDate
    const baseDate = dayjs(workDate);

    // Tách giờ phút từ startTime
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startDate = baseDate
      .set("hour", startHour)
      .set("minute", startMinute)
      .set("second", 0)
      .set("millisecond", 0)
      .toISOString();

    // Tách giờ phút từ endTime
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const endDate = baseDate
      .set("hour", endHour)
      .set("minute", endMinute)
      .set("second", 0)
      .set("millisecond", 0)
      .toISOString();

    return {
      startDate,
      endDate,
    };
  };

  const handleFormSubmit = (data: z.infer<typeof workOrderSchema>) => {
    const { workDate, startTime, endTime, ...cloneData } = data;
    const time = convertToStartEnd(workDate, startTime, endTime);
    const durationInHours = dayjs(time.endDate).diff(
      dayjs(time.startDate),
      "hour"
    );
    if (durationInHours >= 0) {
      const dataSubmit = {
        ...cloneData,
        ...time,
        expectedHours: durationInHours,
      };
      // console.log("object :>> ", dataSubmit);
      onSubmit(dataSubmit);
    } else {
      toast({
        title: "Warning",
        description: "Start time must not be less than end time.",
      });
    }
  };

  useEffect(() => {
    if (!isEmpty(initForm)) {
      // Convert string dates to Date object if necessary
      const formData = {
        ...initForm,
        workDate: initForm.workDate ? new Date(initForm.workDate) : new Date(),
        startTime: dayjs(initForm.startDate).format("HH:mm"),
        endTime: dayjs(initForm.endDate).format("HH:mm"),
        blockId: get(initForm, "blockId._id"),
        siteId: get(initForm, "siteId._id"),
      };
      form.reset(formData);
    }
  }, [initForm]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Selection */}
          {/* <FormField
            control={form.control}
            name="ID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Work Order*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ID work order" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Site Selection */}
          <FormField
            control={form.control}
            name="siteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vineyard Site*</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {managedSites.map((site) => (
                      <SelectItem key={site._id} value={site._id}>
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
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={availableBlocks.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          availableBlocks.length === 0
                            ? "Select a site first"
                            : "Select block"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableBlocks.map((block) => (
                      <SelectItem key={block._id} value={block._id}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Work Date */}
          <FormField
            control={form.control}
            name="workDate"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
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
                  {/* <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                  <FormControl>
                    <Input {...field} type="time" />
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
                  {/* <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                  <FormControl>
                    <Input {...field} type="time" />
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  // defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pruning">Pruning</SelectItem>
                    <SelectItem value="shoot_thinning">
                      Shoot Thinning
                    </SelectItem>
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
                  <Input placeholder="eg: 5" type="number" min="1" {...field} />
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
                  <Input
                    placeholder="eg: 0,5"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Payment rate per vine.</FormDescription>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEmpty(initForm) ? (
              <>{isSubmitting ? "Creating..." : "Create Work Order"}</>
            ) : (
              <>{isSubmitting ? "Updating..." : "Update Work Order"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
