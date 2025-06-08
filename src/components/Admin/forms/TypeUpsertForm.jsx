import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

// Enhanced form validation schema
const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  code: z.string()
    .min(2, "Code must be at least 2 characters")
    .max(50, "Code must be at most 50 characters"),
  description: z.string()
    .max(250, "Description must be at most 250 characters")
    .optional(),
  image: z
    .instanceof(File, { message: "Please upload an image file" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, 
      "File size must be less than 5MB"
    )
    .refine(
      (file) => file.type.startsWith("image/"), 
      "Only image files are allowed"
    )
    .optional(),
  id: z.number().optional()
});

function TypeUpsertForm({ handleSubmit, values }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: values?.name || "",
      code: values?.code || "",
      description: values?.description || "",
      image: undefined,
      id: values?.id || undefined,
    },
  });

  const {
    setError,
    formState: { isSubmitting, errors },
    reset,
    watch,
  } = form;

  const isUpdate = values !== undefined;
  const [imagePreview, setImagePreview] = useState(
    values?.image 
      ? `${import.meta.env.VITE_BACKEND_URL}/storage/${values.image}`
      : ""
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    form.clearErrors("image");
    form.setValue("image", file, { shouldValidate: true });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formData) => {
   

    try {
      // Prepare FormData for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitData.append(key, value);
        }
      });

      await handleSubmit(submitData);

        toast.success(
          isUpdate 
            ? "Filiére updated successfully" 
            : "Filiére created successfully"
        );
       
      
    } catch (error) {
      toast.error("Failed to submit form");
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter Filiére name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Input placeholder="Enter unique code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description (optional)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {errors.image && (
                <p className="text-sm font-medium text-destructive">
                  {errors.image.message}
                </p>
              )}
            </div>
          </FormControl>
          
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-1">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-md border w-32 h-32 object-cover"
              />
            </div>
          )}
        </FormItem>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdate ? "Updating..." : "Creating..."}
              </>
            ) : isUpdate ? (
              "Update Type"
            ) : (
              "Create Type"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TypeUpsertForm;