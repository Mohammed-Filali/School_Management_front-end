import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { UseUserContext } from "../../context/StudentContext";
import { RedirectRoute } from "../../router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).max(50).min(2),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(30),
});

export default function UserLogin() {
  const { login, setAuthenticated, setToken } = UseUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
        form.setError('root', {
          message: 'Invalid email or password. Please try again.',
        });
      } else {
        form.setError('root', {
          message: 'An unexpected error occurred. Please try again later.',
        });
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="p-1 bg-gradient-to-r from-neutral-950 to-neutral-700">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl">
              <div className="text-center mb-8">
                <motion.div
                  className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-slate-600 dark:text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Sign in to access your account
                </p>
              </div>

              <AnimatePresence>
                {form.formState.errors.root && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm"
                  >
                    {form.formState.errors.root.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              placeholder="your@email.com"
                              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                            Password
                          </FormLabel>
                          <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-12 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      className="w-full py-3 px-4 bg-gradient-to-r from-black to-slate-800 hover:from-slate-600 hover:to-black text-white font-medium rounded-lg shadow-md transition-all duration-300"
                      disabled={form.formState.isSubmitting}
                      type="submit"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader className="animate-spin mr-2" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>

             
            </div>
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}