import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [name, setName] = useState<string>("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (): void => {
    const trimmedName = name.trim();
    if (trimmedName === "") return;
    login(trimmedName);
    navigate("/bookings");
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Student access</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Log in to manage bookings</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">This GT3 classroom login protects your booking area. Enter your name to continue.</p>
      <label htmlFor="login-name" className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Student name
        <input id="login-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-500/20" />
      </label>
      <button type="button" onClick={handleLogin} disabled={name.trim() === ""} className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700">
        Continue to my bookings
      </button>
    </section>
  );
}

export default LoginPage;
