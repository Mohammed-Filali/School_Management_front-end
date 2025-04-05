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
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().max(50, "Name must be at most 50 characters."),
  code: z.string().max(50, "Code must be at most 50 characters."),
  description: z.string().max(250, "Description must be at most 250 characters."),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size exceeds the limit of 5MB.")
    .optional(),
});

function TypeUpsertForm({ handleSubmit, values }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: values?.name || "",
          code: values?.code || "",
          description: values?.description || "",
          image: values?.image || "",
          id:values?.id || null,
        },
      });


  const {
    setError,
    formState: { isSubmitting },
    reset,
  } = form;

  const [type, setType] = useState({});

  const isUpdate = values !== undefined;
  const [imagePreview, setImagePreview] = useState(values?.image || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds the limit of 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      form.setValue("image", file);

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data) => {
    console.log("Form Data Before Sending:", data);  // Confirm values before sending

    const loaderMsg = isUpdate ? "Updating in progress." : "Adding parent";
    const loader = toast.loading(loaderMsg);

    try {
      // Create a FormData object
      const formData = new FormData();

      // Append each field to FormData
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("id", values?.id ||null);

      formData.append("description", data.description);

      // Append the image file if it exists
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      // Log FormData entries for debugging
      let updatedType = { ...type };  // Clone the current type object
for (let pair of formData.entries()) {
  console.log(pair[0] + ": " + pair[1]);
  updatedType[pair[0]] = pair[1];
}
setType(updatedType);
      console.log(type);


      // Send the form data
      const response = await handleSubmit(formData);  // Submit using handleSubmit

      if (response.status === 201) {
        toast.success('updated with success');
        reset();
        setImagePreview("");  // Clear image preview on success
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
        Object.entries(errorMessages).forEach(([field, message]) => {
          setError(field, { message });
        });
      }
      toast.error('updated with success');

    } finally {
      toast.dismiss(loader);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} method="POST">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Code" {...field} />
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
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Input id="description" placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel htmlFor="image">Image</FormLabel>
          <FormControl>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FormControl>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
          <FormMessage />
        </FormItem>

        <Button className="mt-2" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />}
          {isUpdate ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default TypeUpsertForm;
