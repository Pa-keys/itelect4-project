import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, registerUser } from "../api/client";
import { registerSchema, type RegisterFormValues } from "../schemas/authSchema";
import useAuthStore from "../store/authStore";
import { GraduationCap, ArrowRight, Lock, Mail, User, AlertCircle } from "lucide-react";

function RegisterPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const registration = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      await registerUser(values);
      return loginUser({ email: values.email, password: values.password });
    },
    onSuccess: ({ token, user }) => {
      setSession(token, user);
      navigate("/bookings");
    },
  });

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/20 mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Student Registration
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Join the campus peer tutoring community to book sessions and prepare with AI.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) => registration.mutate(values))}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="register-name"
                autoComplete="name"
                {...register("name")}
                placeholder="Jane Doe"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/20"
              />
            </div>
            {errors.name && (
              <span className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.name.message}</span>
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                placeholder="student@university.edu"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/20"
              />
            </div>
            {errors.email && (
              <span className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.email.message}</span>
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                placeholder="At least 8 characters"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/20"
              />
            </div>
            {errors.password && (
              <span className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.password.message}</span>
              </span>
            )}
          </div>

          {registration.isError && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
            >
              {registration.error instanceof Error ? registration.error.message : "Could not create your account."}
            </p>
          )}

          <button
            type="submit"
            disabled={registration.isPending}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {registration.isPending ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            Log in
          </Link>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
