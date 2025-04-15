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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

// Enhanced validation schema
const formSchema = z.object({
  firsName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
  date_of_birth: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  gender: z.enum(["m", "f"], {
    required_error: "Please select a gender",
  }),
  blood_Type: z.string({
    required_error: "Please select a blood type",
  }),
  adress: z.string()
    .max(255, { message: "Address cannot exceed 255 characters" }),
  phone: z.string()
    .min(10, { message: "Phone number must be 10 digits" })
    .max(10, { message: "Phone number must be 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  email: z.string()
    .email({ message: "Invalid email address" })
    .min(2, { message: "Email must be at least 2 characters" })
    .max(50, { message: "Email cannot exceed 50 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(30, { message: "Password cannot exceed 30 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
});

export default function ParentUpsertForm({ handleSubmit, values }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firsName: values?.firsName || "",
      lastName: values?.lastName || "",
      date_of_birth: values?.date_of_birth 
        ? format(new Date(values.date_of_birth), "yyyy-MM-dd") 
        : "",
      gender: values?.gender || "",
      blood_Type: values?.blood_Type || "",
      adress: values?.adress || "",
      phone: values?.phone || "",
      email: values?.email || "",
      password: values?.password || ""
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
    reset,
  } = form;

  const isUpdate = values !== undefined;

  const onSubmit = async (formValues) => {
    const loaderMsg = isUpdate ? "Updating parent..." : "Creating parent...";
    const loader = toast.loading(loaderMsg);

    try {
      const result = await handleSubmit(formValues);
      
      if (result?.status === 201) {
        toast.success(
          result.message || 
          (isUpdate ? "Parent updated successfully" : "Parent created successfully")
        );
        if (!isUpdate) {
          reset();
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field, { 
            type: "manual",
            message: Array.isArray(messages) ? messages.join(", ") : messages
          });
        });
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      toast.dismiss(loader);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firsName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Doe" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    max={format(new Date(), "yyyy-MM-dd")}
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                    disabled={isSubmitting}
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="m" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="f" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_Type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="123 Main St, City, Country"
                    className="min-h-[100px]"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">+212</span>
                      <Input 
                        placeholder="612345678" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john.doe@example.com" 
                      type="email"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters with uppercase, lowercase, and number
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
                "Update Parent"
              ) : (
                "Create Parent"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}