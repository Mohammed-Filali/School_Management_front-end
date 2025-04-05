import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { CourApi } from "../../../service/api/student/admins/CourApi";
import { TeacherApi } from "../../../service/api/student/teacherApi";

// Zod schema for validation
const formSchema = z.object({
  coef: z.string(),
  masseH: z.string().nonempty("Masse Horaire is required"),
  class_type_id: z.number(),
  teacher_id: z.string(),
  course_id: z.string().nonempty("Course is required"),
});

export default function ClaseCourForm({ handleSubmit, values, class_id }) {
  const [cours, setCours] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coef: values?.coef || "",
      masseH: values?.masseH || "",
      teacher_id: values?.teacher_id || "",
      class_type_id: values?.class_type_id || class_id,
      course_id: values?.course_id || "",
    },
  });

  const { setError, formState: { isSubmitting }, reset } = form;
  const isUpdate = !!values;

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes] = await Promise.all([
          CourApi.all(["id", "name"]),
          TeacherApi.all(),
        ]);
        setCours(coursesRes.data.data);
        setTeachers(teachersRes.data.data);
      } catch (error) {
        toast.error("Failed to load resources");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form submission handler
  const onSubmit = async (formValues) => {
    const loaderMsg = isUpdate ? "Updating in progress..." : "Adding Student...";
    const loader = toast.loading(loaderMsg);

    try {
      const response = await handleSubmit(formValues);
      if (response.status === 200) {
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {};
      Object.entries(responseErrors).forEach(([fieldName, errorMessages]) => {
        setError(fieldName, { message: errorMessages.join(", ") });
      });
    } finally {
      toast.dismiss(loader);
    }
  };

  // Render
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Coef Field */}
        <FormField
          control={form.control}
          name="coef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coef</FormLabel>
              <FormControl>
                <Input placeholder="Coef" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Masse Horaire Field */}
        <FormField
          control={form.control}
          name="masseH"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Masse Horaire</FormLabel>
              <FormControl>
                <Input placeholder="Masse Horaire" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Class Type ID Field */}
        <FormField
          control={form.control}
          name="class_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Type ID</FormLabel>
              <FormControl>
                <Input   type="hidden" placeholder="Class Type ID" defaultValue={class_id} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Selection */}
        <FormField
          control={form.control}
          name="course_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cours.map((cour) => (
                    <SelectItem key={cour.id} value={cour.id.toString()}>
                      {cour.name || "Unnamed Course"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teacher Selection */}
        <FormField
          control={form.control}
          name="teacher_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button className="mt-2" type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? (
            <>
              <Loader className="mx-2 my-2 animate-spin" /> {isUpdate ? "Updating..." : "Creating..."}
            </>
          ) : (
            isUpdate ? "Update" : "Create"
          )}
        </Button>
      </form>
    </Form>
  );
}
