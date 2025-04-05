import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ParentApi } from "../../../service/api/student/admins/parenpApi";
import { Textarea } from "@/components/ui/textarea";
import { ClasseApi } from "../../../service/api/student/admins/ClasseApi";

const formSchema = z.object({
  name: z.string().max(50),
  date_of_birth: z.string(),
  gender: z.string().max(1),
  blood_Type: z.string(),
  adress: z.string().max(255),
  phone: z.string().max(10),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
  student_parent_id: z.string(),
  classe_id: z.string(),
});

export default function StudentUpsertForm({ handleSubmit, values }) {
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: values?.name || '',
          date_of_birth: values?.date_of_birth || '',
          gender: values?.gender || '',
          blood_Type: values?.blood_Type || '',
          adress: values?.adress || '',
          phone: values?.phone || '',
          email: values?.email || '',
          password: values?.password || '',
          student_parent_id:values?.student_parent_id || '',
          classe_id:values?.classe_id || '',
        }
      });
  const { setError, formState: { isSubmitting }, reset } = form;
  const isUpdate = !!values;

  useEffect(() => {
    ParentApi.all(['id', 'firName', 'lastname']).then(({data}) => setParents(data) )
    ClasseApi.all().then(({data}) => setClasses(data.data) )
  }, []);

  const onSubmit = async (formValues) => {
    const loaderMsg = isUpdate ? "Updating in progress." : "Adding Student";
    const loader = toast.loading(loaderMsg);

    try {
      const response = await handleSubmit(formValues);
        console.log(formValues);

      if (response.status === 200) {
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {

      const responseErrors = error.response?.data?.errors || {};
      Object.entries(responseErrors).forEach(([fieldName, errorMessages]) => {
        setError(fieldName, { message: errorMessages.join() });
      });
    } finally {
      toast.dismiss(loader);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
                <Input type="date" placeholder="Date of Birth" {...field} />
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
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="m" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["O-", "O+", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bloodType, key) => (
                    <SelectItem key={key} value={bloodType}>{bloodType}</SelectItem>
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
                <Textarea placeholder="Address" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="student_parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parents.map((parent, key) => (
                    <SelectItem key={key} value={parent.id.toString()}>
                      {parent.firsName} {parent.lastName}
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
          name="classe_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Classe" />
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
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
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-2" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />} {isUpdate ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
