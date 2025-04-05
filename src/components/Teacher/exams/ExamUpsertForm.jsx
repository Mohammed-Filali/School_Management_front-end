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
import { TeacherApi } from "../../../service/api/student/teacherApi";
import { UseUserContext } from "../../../context/StudentContext";

const formSchema = z.object({
  name: z.string().max(50),
  classe_id: z.string(),
  teacher_id: z.number(),
  course_id: z.string(),
  type: z.string(),
});

export default function ExamUpsertForm({ handleSubmit, values }) {
  const [classes, setClasses] = useState([]);
  const [cours, setCours] = useState([]);
  const { user } = UseUserContext();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: values?.name || '',
      type: values?.type || '',
      classe_id: values?.classe_id || '',
      teacher_id: user.id,
      course_id: values?.course_id || '',
    },
  });

  useEffect(() => {
    // Fetch classes and courses
    TeacherApi.Cours(['id', 'name']).then(({ data }) => setCours(data.data));
    TeacherApi.Classes(['id', 'name']).then(({ data }) => setClasses(data.data));
  }, []);

  // Reset form with updated default values after data is fetched
  useEffect(() => {
    if (classes.length > 0 && cours.length > 0) {
      form.reset({
        name: values?.name || '',
        type: values?.type || '',
        classe_id: values?.classe_id ? values.classe_id.toString() : '',
        teacher_id: user.id,
        course_id: values?.course_id ? values.course_id.toString() : '',
      });
    }
  }, [classes, cours, form, user.id, values]);

  const { setError, formState: { isSubmitting }, reset } = form;
  const isUpdate = values !== undefined;
  const onSubmit = async (values) => {
    const loaderMsg = isUpdate ? 'Updating in progress.' : 'Adding parent';
    const loader = toast.loading(loaderMsg);

    await handleSubmit(values).then(
      ({ status, message }) => {
        if (status === 201) {
          toast.success(message);
          reset();
        }
      }
    ).catch((error) => {
      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
        Object.entries(errorMessages).forEach(([field, message]) => {
          setError(field, { message });
        });
      }
    }).finally(() => {
      toast.dismiss(loader);
    });
  };

  const courFinder = (v) => {
    const c = cours.find((c) => v == c.id);
    return c?.name;
  };

  const classFinder = (v) => {
    const c = classes.find((c) => v == c.id);
    return c?.name;
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teacher_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" placeholder="name" {...field} />
                </FormControl>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{field.value || "Select Type"}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['cc', 'efm', 'eff'].map((Type) => (
                      <SelectItem key={Type} value={Type}>
                        {Type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{form.formState.errors.type?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classe_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{classFinder(field.value) || "Select Classe"}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((classe, key) => (
                      <SelectItem key={key} value={classe.id.toString()}>
                        {classe.name}
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
                <FormLabel>Cours</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{courFinder(field.value) || "Select Course"}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cours.map((cour, key) => (
                      <SelectItem key={key} value={cour.id.toString()}>
                        {cour.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-2" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />} {isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </Form>
    </>
  );
}
