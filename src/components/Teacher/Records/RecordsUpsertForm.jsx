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
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import { UseUserContext } from "../../../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";

const formSchema = z.object({
  note: z.number().min(0).max(20),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(200),
  user_id: z.number({ required_error: "User is required" }),
  exam_id: z.number({ required_error: "Exam is required" }),
});

export default function RecordsUpsertForm({ user_id , classe_id }) {
    const exams = useSelector((state) => state.TeacherExams.exams); // Get exams from Redux
  const [filteredExams, setFilteredExams] = useState([]);
  const { user } = UseUserContext();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: 0,
      comment: "",
      user_id: Number(user_id) || 0,
      exam_id: 0,
    }
  });

  

  useEffect(() => {
    if (exams.length > 0 && user) {
      // Filter exams by teacher_id if needed
      const matchedExams = exams.filter((exam) => 
        exam.classe_id === classe_id
      );
      setFilteredExams(matchedExams);
    }
    
  }, [exams, user,classe_id]);

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting, errors },
    reset,
  } = form;

  const onSubmit = async (values) => {
    console.log("Submitting values:", values);
    const toastId = toast.loading("Creating record...");

    try {
      const response = await ExamApi.createRecord(values);
      toast.dismiss(toastId);
      toast.success("Record created successfully");
      reset();
    } catch (error) {
      toast.dismiss(toastId);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors;
        Object.entries(errorMessages).forEach(([field, message]) => {
          setError(field, { message });
        });
      } else {
        toast.error(error.message || "An unexpected error occurred");
        console.error(error);
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Note field */}
              <FormField
                control={control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (0-20)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exam field */}
              <FormField
                control={control}
                name="exam_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={String(field.value)}
                      disabled={filteredExams.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              filteredExams.length === 0
                                ? "No exams available"
                                : "Select an exam"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredExams.map((exam) => (
                          <SelectItem key={exam.id} value={String(exam.id)}>
                            {exam.name} ({exam.type?.toUpperCase()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comment field */}
            <FormField
              control={control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your comment (5-200 characters)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden user_id field */}
            <FormField
              control={control}
              name="user_id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || filteredExams.length === 0}
                className="min-w-[120px]"
              >
                {isSubmitting && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}