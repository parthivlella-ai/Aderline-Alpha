"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, Building, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Login failed. Please check your credentials.");
      return;
    }

    // Prioritize intended redirect target (e.g. /messages?creatorId=...)
    if (redirectTarget) {
      router.push(redirectTarget);
      return;
    }

    // Role-specific default redirect
    if (result.role === "freelancer") {
      router.push("/dashboard/freelancer");
    } else {
      router.push("/dashboard/client");
    }
  }

  // Quick Demo loggers
  function fillDemoClient() {
    setEmail("client@prismora.ai");
    setPassword("client123");
  }

  function fillDemoFreelancer() {
    setEmail("creator1@prismora.ai");
    setPassword("creator123");
  }

  return (
    <div className="max-w-md w-full rounded-3xl border border-[#261e40] bg-[#140f26] p-8 shadow-2xl shadow-black/60 relative">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-[#9d7bf5] items-center justify-center text-[#0b0914] font-black text-xl mb-4 shadow-lg shadow-[#9d7bf5]/25">
          P
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back to Prismora
        </h1>
        <p className="text-xs text-[#9b92b6] mt-1.5">
          Sign in to access your marketplace dashboard and active conversations.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl border border-red-500/40 bg-red-950/30 text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#7e749e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#7e749e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-50 text-[#0b0914] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#9d7bf5]/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Logins for instant local testing */}
      <div className="mt-6 pt-6 border-t border-[#221a3b]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block text-center mb-3">
          QUICK DEMO ACCOUNTS
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillDemoClient}
            className="px-3 py-2 rounded-lg bg-[#191230] hover:bg-[#231b42] border border-[#302554] text-xs font-medium text-[#c4b5fd] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-[#9d7bf5]" />
            Client Mode
          </button>
          <button
            type="button"
            onClick={fillDemoFreelancer}
            className="px-3 py-2 rounded-lg bg-[#191230] hover:bg-[#231b42] border border-[#302554] text-xs font-medium text-[#c4b5fd] flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Freelancer Mode
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-6 text-center text-xs text-[#8c82ab]">
        Don't have an account yet?{" "}
        <Link
          href={`/signup${redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          className="text-[#9d7bf5] hover:underline font-semibold"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#4c205c]/15 blur-[140px] pointer-events-none -z-10" />
      <Suspense fallback={<div className="text-white text-xs font-mono">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
