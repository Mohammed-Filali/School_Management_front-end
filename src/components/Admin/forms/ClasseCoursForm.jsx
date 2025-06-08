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
// Zod schema for validation
const formSchema = z.object({
  coef: z.string(),
  masseH: z.string().nonempty("Masse Horaire is required"),
  class_type_id: z.number(),
  teacher_id: z.string(),
  course_id: z.string().nonempty("Course is required"),
});

export default function ClaseCourForm({ handleSubmit, values, class_id }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
        const [coursesRes, ] = await Promise.all([
          CourApi.all(["id", "name"]),
        ]);
        setCourses(coursesRes.data.data);
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

 
      await handleSubmit(formValues);
  
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
<FormField
  control={form.control}
  name="course_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Course</FormLabel>
      <Select
        onValueChange={(value) => {
          field.onChange(value);
          const selected = courses.find((c) => c.id.toString() === value);
          setSelectedCourse(selected); // Set the selected course
        }}
        value={field.value?.toString()}
        disabled={isLoading}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id.toString()}>
              {course.name || "Unnamed Course"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Teacher Selection */}
{selectedCourse && (
  <FormField
    control={form.control}
    name="teacher_id"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Teacher</FormLabel>
        <Select
          onValueChange={field.onChange}
          value={field.value?.toString()}
          disabled={isLoading}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select Teacher" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {selectedCourse.teachers?.map((teacher) => (
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
)}


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
