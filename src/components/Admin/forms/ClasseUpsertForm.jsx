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
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi";

const formSchema = z.object({
  name: z.string().max(50),
  code: z.string().max(50),
  class_type_id: z.string(),

})

export default function ClasseUpsertForm({ handleSubmit, values }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: values?.name || '',
        code: values?.code || '',
        class_type_id: values?.class_type_id || '',

    }
  });
  const [types ,setTypes] = useState([])

  const { setError, formState: { isSubmitting }, reset } = form;
  const isUpdate = values !== undefined;
  useEffect(() => {
      ClasseApi.types(['id', 'name']).then(({data}) => setTypes(data.data) )
    }, []);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         <FormField
          control={form.control}
          name="class_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Types</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types.map((type, key) => (
                    <SelectItem key={key} value={type.id.toString()}>
                      {type.name}
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
