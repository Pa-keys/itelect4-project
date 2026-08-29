import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="mt-5 space-y-2">
        <Label htmlFor="login-name" className="text-slate-700 dark:text-slate-200">
          Student name
        </Label>
        <Input
          id="login-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-11 rounded-xl border-slate-300 bg-white text-slate-900 focus-visible:border-sky-500 focus-visible:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus-visible:ring-sky-500/20"
        />
      </div>
      <Button
        type="button"
        onClick={handleLogin}
        disabled={name.trim() === ""}
        className="mt-4 min-h-10 w-full rounded-xl bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-600 dark:text-white dark:hover:bg-sky-500"
      >
        Continue to my bookings
      </Button>
    </section>
  );
}

export default LoginPage;
