"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  User,
  Building,
  CheckCircle2,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MARKETPLACE_CATEGORIES, type AccountRole } from "@/types";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");
  const { signup } = useAuth();

  const [role, setRole] = useState<AccountRole>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Advertising & Commercials");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!fullName.trim() || !displayName.trim()) {
      setError("Please provide your full name and display name.");
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      email: email.trim(),
      password,
      role,
      fullName: fullName.trim(),
      displayName: displayName.trim(),
      companyName: companyName.trim() || undefined,
      businessCategory: role === "client" ? businessCategory : undefined,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Signup failed. Please try again.");
      return;
    }

    // Prioritize redirect target if present
    if (redirectTarget) {
      router.push(redirectTarget);
      return;
    }

    // Role-specific redirect
    if (result.role === "freelancer") {
      router.push("/dashboard/freelancer");
    } else {
      router.push("/dashboard/client");
    }
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#4c205c]/15 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-lg w-full rounded-3xl border border-[#261e40] bg-[#140f26] p-8 shadow-2xl shadow-black/60 relative">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#9d7bf5] items-center justify-center text-[#0b0914] font-black text-xl mb-4 shadow-lg shadow-[#9d7bf5]/25">
            P
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create your Prismora account
          </h1>
          <p className="text-xs text-[#9b92b6] mt-1.5">
            Join the premier marketplace for generative AI video, audio, and visual creators.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl border border-red-500/40 bg-red-950/30 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Account Role Selector: Client vs Freelancer */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-2 font-medium">
              Choose Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Client Card */}
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  role === "client"
                    ? "bg-[#251b42] border-[#9d7bf5] shadow-md shadow-[#9d7bf5]/20"
                    : "bg-[#0b0914] border-[#271f43] hover:border-[#382b61]"
                }`}
              >
                {role === "client" && (
                  <CheckCircle2 className="w-4 h-4 text-[#9d7bf5] absolute top-3 right-3" />
                )}
                <Building className="w-5 h-5 text-[#9d7bf5] mb-2" />
                <h4 className="font-bold text-sm text-white">Client / Brand</h4>
                <p className="text-[11px] text-[#9b92b6] mt-1 leading-snug">
                  I want to commission AI content & hire creators.
                </p>
              </button>

              {/* Freelancer Card */}
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  role === "freelancer"
                    ? "bg-[#251b42] border-[#9d7bf5] shadow-md shadow-[#9d7bf5]/20"
                    : "bg-[#0b0914] border-[#271f43] hover:border-[#382b61]"
                }`}
              >
                {role === "freelancer" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-3 right-3" />
                )}
                <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm text-white">Freelancer</h4>
                <p className="text-[11px] text-[#9b92b6] mt-1 leading-snug">
                  I create AI visuals and want to sell my work.
                </p>
              </button>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                {role === "client" ? "Company / Brand Name" : "Display / Studio Name"}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (role === "client") setCompanyName(e.target.value);
                }}
                placeholder={role === "client" ? "Velvet Luxe Agency" : "Aetheris Studios"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
              />
            </div>
          </div>

          {/* If Client: Business Category selector */}
          {role === "client" && (
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Business Niche / Category
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5] transition-colors"
              >
                {MARKETPLACE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat} className="bg-[#140f26] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Email */}
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
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7e749e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3.5 px-4 rounded-xl bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-50 text-[#0b0914] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#9d7bf5]/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Sign Up as {role === "client" ? "Client" : "Freelancer"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-[#8c82ab]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#9d7bf5] hover:underline font-semibold">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0914] flex items-center justify-center text-white text-xs font-mono">Loading sign up...</div>}>
      <SignupForm />
    </Suspense>
  );
}
