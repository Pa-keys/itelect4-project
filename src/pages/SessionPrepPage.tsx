import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { askAi } from "../api/client";
import { Button } from "../components/ui/button";
import { sessionPrepFormSchema, type SessionPrepFormValues } from "../schemas/sessionPrepSchema";
import type { SessionPrep, SupportLevel } from "../types";
import {
  Sparkles,
  Target,
  CheckCircle2,
  ListOrdered,
  Copy,
  Check,
  BrainCircuit,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const supportLevelStyle: Record<SupportLevel, string> = {
  "light-guidance": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300",
  "focused-help": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300",
  "foundational-help": "border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-300",
};

const supportLevelLabel: Record<SupportLevel, string> = {
  "light-guidance": "Light Guidance",
  "focused-help": "Focused Help",
  "foundational-help": "Foundational Help",
};

function PrepResult({ prep }: { prep: SessionPrep }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `Session Prep Plan
Support Level: ${supportLevelLabel[prep.supportLevel]}

Goal:
${prep.learningGoal}

Focus Areas:
${prep.focusAreas.map((a) => `- ${a}`).join("\n")}

Prep Steps:
${prep.prepSteps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      aria-live="polite"
      className="mt-8 rounded-3xl border border-purple-200/80 bg-gradient-to-b from-purple-50/40 via-white to-white p-6 shadow-sm dark:border-purple-900/40 dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/30">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Generated Study Roadmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized Gemini AI session blueprint
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${supportLevelStyle[prep.supportLevel]}`}
          >
            {supportLevelLabel[prep.supportLevel]}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Learning Goal Card */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-950 dark:bg-purple-950/30">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            <Target className="h-4 w-4" />
            <span>Target Learning Objective</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
            {prep.learningGoal}
          </p>
        </div>

        {/* Focus Areas & Prep Steps Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Focus Areas */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Core Focus Areas</span>
            </h3>
            <ul className="mt-3 space-y-2">
              {prep.focusAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prep Steps */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <ListOrdered className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Recommended Action Steps</span>
            </h3>
            <ol className="mt-3 space-y-2.5">
              {prep.prepSteps.map((step, idx) => (
                <li
                  key={step}
                  className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function SessionPrepPage() {
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const tutorParam = searchParams.get("tutor");
  const noteParam = searchParams.get("note");

  const form = useForm<SessionPrepFormValues>({
    resolver: zodResolver(sessionPrepFormSchema),
    defaultValues: { prompt: "" },
  });

  const promptValue = form.watch("prompt") ?? "";
  const mutation = useMutation({ mutationFn: askAi });

  // Auto-populate prompt from deep link if available
  useEffect(() => {
    if (subjectParam) {
      let initialPrompt = `I have an upcoming tutoring session on ${subjectParam}`;
      if (tutorParam) {
        initialPrompt += ` with tutor ${tutorParam}`;
      }
      if (noteParam) {
        initialPrompt += `. My specific goal is: ${noteParam}.`;
      } else {
        initialPrompt += `. I want to understand the foundational principles and clarify my confusion on practical exercises.`;
      }
      form.setValue("prompt", initialPrompt, { shouldValidate: true });
    }
  }, [subjectParam, tutorParam, noteParam, form]);

  const onSubmit = ({ prompt }: SessionPrepFormValues): void => mutation.mutate(prompt);

  const samplePrompts = [
    "I need help understanding React useEffect dependencies and when to trigger re-renders.",
    "Preparing for Python algorithms: I struggle with recursive functions and edge case termination.",
    "Reviewing TypeScript interfaces vs types and advanced generics before my tutoring session.",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-200/80 bg-white p-6 shadow-sm dark:border-purple-900/40 dark:bg-slate-900/90 sm:p-8">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
            <span>Google Gemini AI Study Assistant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Session Preparation
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
            Describe the topic or homework you want help with. Gemini will generate a tailored study plan with your target objective, key focus areas, and recommended preparation steps.
          </p>

          {/* Quick Starter Chips */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>Prompt Ideas (Click to populate):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => form.setValue("prompt", sample, { shouldValidate: true })}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-purple-700 dark:hover:bg-purple-950/40"
                >
                  {sample.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Input Form */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="learning-needs"
                className="text-sm font-bold text-slate-900 dark:text-white"
              >
                Describe your learning goals & difficulties
              </label>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {promptValue.length} / 2,000 characters
              </span>
            </div>
            <textarea
              id="learning-needs"
              rows={6}
              disabled={mutation.isPending}
              aria-invalid={Boolean(form.formState.errors.prompt)}
              {...form.register("prompt")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-purple-500/20 disabled:opacity-50"
              placeholder="E.g., I'm having trouble understanding how async/await works in JavaScript when handling multiple API calls in parallel..."
            />
            {form.formState.errors.prompt && (
              <p role="alert" className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {form.formState.errors.prompt.message}
              </p>
            )}
            {mutation.isError && (
              <p role="alert" className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "Could not generate session prep. Please check the API."}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Generating Roadmap with Gemini...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Create Session Prep</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            )}
          </Button>
        </form>

        {mutation.data && <PrepResult prep={mutation.data} />}
      </section>
    </div>
  );
}

export default SessionPrepPage;
