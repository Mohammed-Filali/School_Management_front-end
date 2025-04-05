import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Loader } from "lucide-react"; // For loading spinner
import { AxiosClient } from "../api/axios";
import { AdminApi } from "../service/api/student/admins/adminApi";

export default function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const loader = toast.loading("Sending password reset link...");

    try {
      const response = await AdminApi.ForgotPassword(data)

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Password reset link sent successfully!");
        reset(); // Reset form fields
      } else {
        toast.error(result.message || "Failed to send reset link.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the reset link.");
    } finally {
      setIsSubmitting(false);
      toast.dismiss(loader);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Forgot Your Password?</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            className="mt-1"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
          {isSubmitting ? (
            <>
              <Loader className="animate-spin mr-2" /> Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </div>
  );
}
