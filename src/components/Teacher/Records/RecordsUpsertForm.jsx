import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import { useEffect, useState } from "react";
import { ExamApi } from "../../../service/api/student/teachers/ExamApi";
import { UseUserContext } from "../../../context/StudentContext";

const formSchema = z.object({
    note: z.number().max(20).min(0),
    comment:z.string(),
    user_id: z.number(),
    exam_id: z.string(),

})

export default function RecordsUpsertForm({ handleSubmit, values ,user_id }) {
      const [exams, setExams] = useState([]);
      const [exam, setExam] = useState([]);
      const {user}= UseUserContext()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: values?.note || '',
      user_id: values?.user_id || user_id,
      exam_id: values?.exam_id || '',
      comment: values?.comment || '',

    }
  });

   useEffect(() => {
      ExamApi.all().then(({data}) => setExams(data.data) )

    }, []);
    useEffect(()=>{
        if(exams.length>0 && user){

            const matchedClasses = exams.filter((s) => s.teacher_id === user.id);
            setExam(matchedClasses); // Always an array of matched classes

      }
      console.log(exam);

    },[exams,user])

  const { setError, formState: { isSubmitting }, reset } = form;
  const isUpdate = values !== undefined;
  const onSubmit = async (values) => {

    const loaderMsg = isUpdate ? 'Updating in progress.' : 'Adding parent';
    const loader = toast.loading(loaderMsg);

    await handleSubmit(values).then(
      ({ status ,message}) => {
        if (status === 201) {
          toast.success(message);
          reset();
        }
      }
    ).catch((error) => {
        if (error.response && error.response.data.errors) {
            const errorMessages = error.response.data.errors;
            // For example, you could set each error to form fields
            Object.entries(errorMessages).forEach(([field, message]) => {
                setError(field, { message });
            });
        }



    }).finally(() => {
      toast.dismiss(loader);
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
        <FormField
  control={form.control}
  name="note"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Note</FormLabel>
      <Input
        type="number"
        placeholder="Enter a note"
        {...field}
        onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number
      />
      <FormMessage />
    </FormItem>
  )}
/>

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input placeholder="comment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />




          <FormField
            control={form.control}
            name="user_id"

            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Input type="hidden" placeholder="name" defaultValue={user_id} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


            <FormField
          control={form.control}
          name="exam_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exams</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {exam.map((ex, key) => (
                    <SelectItem key={key} value={ex.id.toString()}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />



          <Button className="mt-2" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />} {' '}
            {isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </Form>
    </>
  );
}
