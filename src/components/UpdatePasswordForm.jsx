import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";

// Define Zod schema for password update validation
const passwordSchema = z
  .object({
    current_password: z
      .string()
      .nonempty("Current password is required"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .nonempty("Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function UpdatePasswordForm({ onSubmitHandler }) {
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirmPassword: "",
    },
  });

  const { formState: { isSubmitting }, setError } = form;

  // Form submission handler
  const onSubmit = async (values) => {
    const loader = toast.loading("Updating password...");
    try {
      const response = await onSubmitHandler(values); // Call API or handle form data
      if (response.status === 200) {
        toast.success("Password updated successfully!");
        form.reset(); // Reset the form after success
      }
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {};
      Object.entries(responseErrors).forEach(([fieldName, errorMessages]) => {
        setError(fieldName, { message: errorMessages.join(", ") });
      });
      toast.error("Failed to update password.");
    } finally {
      toast.dismiss(loader);
    }
  };

  return (
    <div className="p-2">
        <div className="w-100 text-center">
            <h3 className="text-gray-900 dark:text-white" >Update your Password </h3>
        </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password Field */}
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter current password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full mt-2" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="animate-spin mr-2" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
