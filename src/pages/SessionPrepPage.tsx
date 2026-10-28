import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { askAi } from "../api/client";
import { Button } from "../components/ui/button";
import { sessionPrepFormSchema, type SessionPrepFormValues } from "../schemas/sessionPrepSchema";
import type { SessionPrep, SupportLevel } from "../types";

const supportLevelStyle: Record<SupportLevel, string> = {
  "light-guidance": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200",
  "focused-help": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100",
  "foundational-help": "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-100",
};

const supportLevelLabel: Record<SupportLevel, string> = {
  "light-guidance": "Light guidance",
  "focused-help": "Focused help",
  "foundational-help": "Foundational help",
};

function PrepResult({ prep }: { prep: SessionPrep }) {
  return <section aria-live="polite" className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Your session prep</h2><span className={`rounded-full border px-3 py-1 text-xs font-bold ${supportLevelStyle[prep.supportLevel]}`}>{supportLevelLabel[prep.supportLevel]}</span></div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2"><div><h3 className="text-sm font-semibold text-slate-950 dark:text-white">Learning goal</h3><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{prep.learningGoal}</p></div><div><h3 className="text-sm font-semibold text-slate-950 dark:text-white">Focus areas</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{prep.focusAreas.map((area) => <li key={area}>{area}</li>)}</ul></div><div className="sm:col-span-2"><h3 className="text-sm font-semibold text-slate-950 dark:text-white">Prep steps</h3><ol className="mt-1 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{prep.prepSteps.map((step) => <li key={step}>{step}</li>)}</ol></div></div>
  </section>;
}

function SessionPrepPage() {
  const form = useForm<SessionPrepFormValues>({ resolver: zodResolver(sessionPrepFormSchema), defaultValues: { prompt: "" } });
  const mutation = useMutation({ mutationFn: askAi });
  const onSubmit = ({ prompt }: SessionPrepFormValues): void => mutation.mutate(prompt);
  return <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Protected learning support</p><h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">AI Session Prep</h1><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Describe the topic you need help with, what you understand, where you are confused, and what you want to achieve in a tutoring session.</p>
    <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)}><label htmlFor="learning-needs" className="text-sm font-semibold text-slate-950 dark:text-white">Your learning needs</label><textarea id="learning-needs" rows={8} disabled={mutation.isPending} aria-invalid={Boolean(form.formState.errors.prompt)} {...form.register("prompt")} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder="Example: I need help with..." />{form.formState.errors.prompt && <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{form.formState.errors.prompt.message}</p>}{mutation.isError && <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{mutation.error instanceof Error ? mutation.error.message : "Could not prepare your session. Please try again."}</p>}<Button className="mt-4" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Preparing your session..." : "Create session prep"}</Button></form>
    {mutation.data && <PrepResult prep={mutation.data} />}
  </section>;
}

export default SessionPrepPage;
