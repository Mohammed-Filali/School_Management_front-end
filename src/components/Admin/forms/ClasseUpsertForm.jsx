import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi";
import { Card } from "@/components/ui/card";

// Enhanced validation schema with better error messages
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  code: z.string()
    .min(2, { message: "Code must be at least 2 characters" })
    .max(50, { message: "Code cannot exceed 50 characters" }),
  class_type_id: z.string({
    required_error: "Please select a class type",
  }),
});

export default function ClasseUpsertForm({ handleSubmit, values }) {
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: values?.name || "",
      code: values?.code || "",
      class_type_id: values?.class_type_id?.toString() || "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
    reset,
  } = form;

  const isUpdate = values !== undefined;

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoadingTypes(true);
        const { data } = await ClasseApi.types(['id', 'name']);
        setTypes(data.data);
      } catch (error) {
        console.error("Error fetching class types:", error);
        toast.error("Failed to load class types");
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, []);

  const onSubmit = async (formValues) => {

    try {
      await handleSubmit({
        ...formValues,
        class_type_id: parseInt(formValues.class_type_id),
      });

      toast.success((isUpdate ? "Class updated successfully" : "Class created successfully"));

    } catch (error) {
      console.error('submit error:', error);
      
      
    } 
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Grade 10 Mathematics" 
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The display name for this class
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., MATH-10"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  A unique identifier for this class
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isSubmitting || loadingTypes}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingTypes ? (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        Loading types...
                      </div>
                    ) : types.length > 0 ? (
                      types.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        No types available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The category this class belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || !isDirty}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUpdate ? "Updating..." : "Creating..."}
                </>
              ) : isUpdate ? (
                "Update Class"
              ) : (
                "Create Class"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}