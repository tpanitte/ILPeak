"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// --- 1. Validation Schema ---
const formSchema = z.object({
  name: z.string().min(3, { message: "Program name is required" }),

  // The Rhythm
  classroomDay: z.string({ required_error: "Please select a regular class day" }),
  totalClassrooms: z.coerce.number().min(1).default(20),

  // The Milestones
  preClassDate: z.date({ required_error: "Pre-Class date is required" }),
  weekend1Date: z.date({ required_error: "Weekend 1 start date is required" }),
  weekend2Date: z.date({ required_error: "Weekend 2 start date is required" }),
  weekend3Date: z.date({ required_error: "Weekend 3 start date is required" }),
  weekend4Date: z.date({ required_error: "Weekend 4 start date is required" }),
});

export type ConfigFormData = z.infer<typeof formSchema>;

interface Step1Props {
  onNext: (data: ConfigFormData) => void;
  defaultValues?: Partial<ConfigFormData>;
}

export function Step1Config({ onNext, defaultValues }: Step1Props) {
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroomDay: "4", // Default to Thursday
      totalClassrooms: 20,
      ...defaultValues,
    },
  });

  const weekDays = [
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "0" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">

        {/* SECTION 1: IDENTITY & RHYTHM */}
        <div className="bg-card border rounded-lg p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Program Structure</h2>
              <p className="text-sm text-muted-foreground">Define the program name and regular teaching schedule.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Row 1: Program Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ILP XX" className="text-lg font-medium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 2: Grid for Day & Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="classroomDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classroom Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekDays.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Day of the week for regular classes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalClassrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Sessions</FormLabel>
                    <FormControl>
                      <Input
                        type="number" {...field}
                        className="w-24"
                      />
                    </FormControl>
                    <FormDescription>
                      Number of classroom sessions to generate (e.g., 20).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: THE ANCHORS */}
        <div className="bg-card border rounded-lg p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Key Milestones</h2>
              <p className="text-sm text-muted-foreground">
                Set the <strong>Start Date</strong> for each major block.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <DatePickerField
                form={form}
                name="preClassDate"
                label="Pre-Class Orientation"
                description="Usually a Friday evening."
              />
            </div>

            <DatePickerField
              form={form}
              name="weekend1Date"
              label="Weekend #1 Start"
              description="Fri-Sun (3 Days)"
            />

            <DatePickerField
              form={form}
              name="weekend2Date"
              label="Weekend #2 Start"
              description="Sat-Sun (2 Days)"
            />

            <DatePickerField
              form={form}
              name="weekend3Date"
              label="Weekend #3 Start"
              description="Sat-Sun (2 Days)"
            />

            <DatePickerField
              form={form}
              name="weekend4Date"
              label="Weekend #4 Start"
              description="Sat-Sun (2 Days)"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="w-full md:w-auto px-8 font-semibold">
            Next: Review Schedule &rarr;
          </Button>
        </div>
      </form>
    </Form>
  );
}

// --- Reusable Date Picker ---
function DatePickerField({ form, name, label, description }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="font-medium">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal h-11",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "EEEE, MMMM d, yyyy")
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
                disabled={(date) => date < new Date("2020-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
