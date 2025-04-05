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
import { useEffect, useState } from "react";
import { CourApi } from "../../../service/api/student/admins/CourApi";

const formSchema = z.object({
  firsName: z.string().max(50),
  lastName: z.string().max(50),
  date_of_birth: z.string(),
  gender: z.string().max(1),
  blood_Type: z.string(),
  adress: z.string().max(255),
  phone: z.string().max(10),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30),
  course_id: z.string()
})

export default function TeacherUpsertForm({ handleSubmit, values }) {

    const [cours,setCours]=useState([]);
    useEffect(()=>{
        CourApi.all().then(({data})=>{
            setCours(data.data)
        })
    },[])
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firsName: values?.firsName || '',
      lastName: values?.lastName || '',
      date_of_birth: values?.date_of_birth || '',
      gender: values?.gender || '',
      blood_Type: values?.blood_Type || '',
      adress: values?.adress || '',
      phone: values?.phone || '',
      email: values?.email || '',
      password: values?.password || '',
      course_id: values?.course_id || ''
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
            name="firsName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input placeholder="firsName" {...field} />
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
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="lastName" {...field} />
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
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Date of birth" {...field} />
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
              <FormLabel>Exams</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
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
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="m" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Male
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="f" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Female
                      </FormLabel>
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
                        <SelectValue>{field.value || "Select Blood Type"}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bloodType) => (
                        <SelectItem key={bloodType} value={bloodType}>
                          {bloodType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{form.formState.errors.blood_type?.message}</FormMessage>
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
                  <Textarea
                    placeholder="Address"
                    className="resize-none"
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
            type="tel"
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
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />} {' '}
            {isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </Form>
    </>
  );
}
