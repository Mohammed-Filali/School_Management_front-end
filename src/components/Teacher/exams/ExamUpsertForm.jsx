// ExamUpsertForm.jsx
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UseUserContext } from "../../../context/StudentContext";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classe_id: z.string({ required_error: "Please select a class" }),
  teacher_id: z.number(),
  course_id: z.string({ required_error: "Please select a course" }),
  type: z.string({ required_error: "Please select an exam type" }),
});

export default function ExamUpsertForm({ handleSubmit, values }) {
  const { user } = UseUserContext();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: values?.name || "",
      type: values?.type || "",
      classe_id: values?.classe_id?.toString() || "",
      teacher_id: user.id,
      course_id: values?.course_id?.toString() || (user.course?.id?.toString() || ""),
    },
  });

  const onSubmit = async (formValues) => {
    const isUpdate = !!values;
    const loader = toast.loading(isUpdate ? "Updating..." : "Creating...");
    try {
      await handleSubmit(formValues);
      toast.success(isUpdate ? "Exam updated" : "Exam created");
      if (!isUpdate) form.reset();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      toast.dismiss(loader);
    }
  };

  const availableClasses = user.classes?.flatMap(t => t.class_type.classe) || [];
  const availableCourse = user.course;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classe_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
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
          name="course_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCourse && (
                    <SelectItem value={availableCourse.id.toString()}>
                      {availableCourse.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cc">CC</SelectItem>
                  <SelectItem value="efm">EFM</SelectItem>
                  <SelectItem value="eff">EFF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {values ? "Update Exam" : "Create Exam"}
        </Button>
      </form>
    </Form>
  );
}
