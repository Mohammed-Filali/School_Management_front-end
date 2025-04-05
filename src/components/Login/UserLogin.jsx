import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { UseUserContext } from "../../context/StudentContext";
import { RedirectRoute } from "../../router";
import { motion } from "framer-motion";

// Validation schema
const formSchema = z.object({
  email: z.string().email().max(50).min(2),
  password: z.string().min(8).max(30),
});

export default function UserLogin() {
  const { login, setAuthenticated, setToken } = UseUserContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "mohammed@gmail.com",
      password: "123456789",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const res = await login(values);
      if (res.success) {
        setToken(res.token);
        setAuthenticated(true);
        const { role } = res.data;
        navigate(RedirectRoute(role));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        form.setError('email', {
          message: 'Invalid credentials, please try again.',
        });
      } else {
        form.setError('email', {
          message: 'An unexpected error occurred',
        });
      }
      console.log(error);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-700 dark:to-indigo-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="space-y-8 w-[30rem] p-12 bg-white dark:bg-gray-800 shadow-xl rounded-lg"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Welcome Back!</h1>

        {/* Animated Card inside Form */}
        <motion.div
          className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="p-4 rounded-md shadow-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="p-4 rounded-md shadow-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  disabled={form.formState.isSubmitting}
                  type="submit"
                >
                  {form.formState.isSubmitting && <Loader className="animate-spin mr-2" />}
                  Log In
                </Button>
                {/* <Link to="/forgot_Password" className="text-blue-600 hover:text-blue-800 text-sm">
                  Forgot Password?
                </Link> */}
              </div>
            </form>
          </Form>
        </motion.div>


      </motion.div>
    </motion.div>
  );
}
