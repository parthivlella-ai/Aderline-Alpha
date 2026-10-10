"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Sparkles,
  Bookmark,
  MessageSquare,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="border-b border-[#1f1936] bg-[#0b0914]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#9d7bf5] flex items-center justify-center text-[#0b0914] font-black text-sm shadow-md shadow-[#9d7bf5]/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight leading-none">
              Prismora
            </span>
            <span className="text-[10px] text-[#8e84b0] tracking-wider uppercase font-mono mt-0.5">
              AI Marketplace
            </span>
          </div>
        </Link>

        {/* Navigation Links based on Auth / Role */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/marketplace"
            className={`flex items-center gap-1.5 transition-colors ${
              pathname === "/marketplace" ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#9d7bf5]" />
            Discover Work
          </Link>

          {/* Client Navigation */}
          {user && role === "client" && (
            <>
              <Link
                href="/creators"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/creators") ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <User className="w-4 h-4 text-[#9d7bf5]" />
                Find Creators
              </Link>
              <Link
                href="/saved"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === "/saved" ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <Bookmark className="w-4 h-4 text-[#9d7bf5]" />
                Saved
              </Link>
              <Link
                href="/messages"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/messages") ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#9d7bf5]" />
                Messages
              </Link>
              <Link
                href="/dashboard/client"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === "/dashboard/client" ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#9d7bf5]" />
                Dashboard
              </Link>
            </>
          )}

          {/* Freelancer Navigation */}
          {user && role === "freelancer" && (
            <>
              <Link
                href="/portfolio"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === "/portfolio" ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#9d7bf5]" />
                My Portfolio
              </Link>
              <Link
                href="/messages"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/messages") ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#9d7bf5]" />
                Messages
              </Link>
              <Link
                href="/dashboard/freelancer"
                className={`flex items-center gap-1.5 transition-colors ${
                  pathname === "/dashboard/freelancer" ? "text-white font-semibold" : "text-[#a8a0c5] hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#9d7bf5]" />
                Dashboard
              </Link>
              <Link
                href="/posts/new"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Upload Work
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions: Theme Toggle + Auth Buttons / Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Simple Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-[#2d2252] bg-[#16102b] hover:bg-[#251b47] text-[#c4b5fd] transition-colors"
            aria-label="Toggle light and dark mode"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-violet-400" />
            )}
          </button>

          {/* If NOT logged in: Login and Sign Up buttons */}
          {!user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#c4b5fd] hover:text-white hover:bg-[#1a1333] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-md shadow-[#9d7bf5]/20"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            /* Logged in: Profile Pill + Logout */
            <div className="flex items-center gap-2.5">
              <Link
                href={role === "client" ? "/profile/client" : "/profile/freelancer"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2f2357] bg-[#17112e] hover:border-[#473582] text-xs transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#9d7bf5] text-[#0b0914] font-bold text-[10px] flex items-center justify-center">
                  {user.display_name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white leading-none truncate max-w-[100px]">
                    {user.display_name}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-[#9d7bf5] mt-0.5">
                    {user.role}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-full border border-[#2d2252] bg-[#16102b] hover:bg-rose-950/40 hover:border-rose-800/40 text-[#8e84b0] hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
