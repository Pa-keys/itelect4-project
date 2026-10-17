import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../api/client";
import { loginSchema, type LoginFormValues } from "../schemas/authSchema";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: "onBlur" });
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: ({ token, user }) => { setSession(token, user); navigate("/bookings"); },
  });

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Student access</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Log in to manage bookings</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Use the email and password registered with the booking platform.</p>
      <form onSubmit={handleSubmit((values) => login.mutate(values))} className="mt-5 grid gap-4">
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email
          <input id="login-email" type="email" autoComplete="email" {...register("email")} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-500/20" />
          {errors.email && <span className="mt-1 block text-sm text-rose-600 dark:text-rose-300">{errors.email.message}</span>}
        </label>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password
          <input id="login-password" type="password" autoComplete="current-password" {...register("password")} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-500/20" />
          {errors.password && <span className="mt-1 block text-sm text-rose-600 dark:text-rose-300">{errors.password.message}</span>}
        </label>
        {login.isError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">{login.error instanceof Error ? login.error.message : "Could not log in."}</p>}
        <button type="submit" disabled={login.isPending} className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700">
          {login.isPending ? "Signing in..." : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">No account yet? <Link to="/register" className="font-semibold text-sky-700 hover:underline dark:text-sky-300">Register</Link></p>
    </section>
  );
}

export default LoginPage;
