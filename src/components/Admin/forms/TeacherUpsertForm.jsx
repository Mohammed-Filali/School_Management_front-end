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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "../../ui/textarea";
import { useEffect, useState } from "react";
import { CourApi } from "../../../service/api/student/admins/CourApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  date_of_birth: z.string().refine(val => moment(val, 'YYYY-MM-DD', true).isValid(), {
    message: "Please enter a valid date (YYYY-MM-DD)",
  }),
  gender: z.enum(["m", "f"]),
  blood_Type: z.string().min(1, "Please select a blood type"),
  address: z.string().min(5, "Address must be at least 5 characters").max(255),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  email: z.string().email("Please enter a valid email").min(2).max(30),
  password: z.string().min(8, "Password must be at least 8 characters").max(30),
  course_id: z.string().min(1, "Please select a course"),
});

export default function TeacherUpsertForm({ handleSubmit, values, onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [dateInput, setDateInput] = useState(
    values?.date_of_birth ? moment(values.date_of_birth).format('YYYY-MM-DD') : ""
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await CourApi.all();
        setCourses(data.data);
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: values?.firstName || "",
      lastName: values?.lastName || "",
      date_of_birth: values?.date_of_birth || "",
      gender: values?.gender || "m",
      blood_Type: values?.blood_Type || "",
      address: values?.address || "",
      phone: values?.phone || "",
      email: values?.email || "",
      password: values?.password || "",
      course_id: values?.course_id || "",
    },
  });

  const {
    setError,
    formState: { isSubmitting },
    reset,
    setValue,
    trigger,
  } = form;
  const isUpdate = values !== undefined;

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateInput(value);
    setValue("date_of_birth", value);
    trigger("date_of_birth");
  };

  const onSubmit = async (formValues) => {
    const loaderMsg = isUpdate ? "Updating teacher..." : "Creating teacher...";
    const loader = toast.loading(loaderMsg);

    try {
      const { status, message } = await handleSubmit(formValues);
      if (status === 201 || status === 200) {
        toast.success(message);
        reset();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors;
        Object.entries(errorMessages).forEach(([field, message]) => {
          setError(field, { message });
        });
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      toast.dismiss(loader);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isUpdate ? "Update Teacher" : "Create New Teacher"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
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
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={dateInput}
                          onChange={handleDateChange}
                          max={moment().format('YYYY-MM-DD')}
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
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="m" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
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
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Main St, City, Country"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Medical and Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                
                <FormField
                  control={form.control}
                  name="blood_Type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["O-", "O+", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                            (bloodType) => (
                              <SelectItem key={bloodType} value={bloodType}>
                                {bloodType}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Account and Course Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                
            
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
           
                
                <FormField
                  control={form.control}
                  name="course_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Course</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loadingCourses}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Select course"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem
                              key={course.id}
                              value={course.id.toString()}
                            >
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="min-w-32">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUpdate ? "Updating..." : "Creating..."}
                  </>
                ) : isUpdate ? (
                  "Update Teacher"
                ) : (
                  "Create Teacher"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}