import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {Textarea} from "../../ui/textarea";

const formSchema = z.object({
  name: z.string().max(50),
  desc: z.string().max(255),

})

export default function CourUpsertForm({ handleSubmit, values }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: values?.name || '',
      desc: values?.desc || '',
    }
  });

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
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="desc"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
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
