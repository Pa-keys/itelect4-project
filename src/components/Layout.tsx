import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
    isActive
      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-600 dark:text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
  }`;

function Layout() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = user?.name ?? null;

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = (): void => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-dvh flex flex-col bg-[#f8fafc] text-slate-900 transition-colors dark:bg-[#0b0f19] dark:text-slate-100">
        {/* Sticky Academic Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Brand Logo & Emblem */}
            <NavLink
              to="/"
              className="group flex items-center gap-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/20 transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Peer<span className="text-blue-600 dark:text-blue-400">Tutor</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Campus Studio
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-1.5"
            >
              <NavLink to="/" end className={navLinkClass}>
                <Layers className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/tutors" className={navLinkClass}>
                <UserIcon className="h-4 w-4" />
                <span>Tutors</span>
              </NavLink>
              <NavLink to="/sessions" className={navLinkClass}>
                <Calendar className="h-4 w-4" />
                <span>Sessions</span>
              </NavLink>
              {userName !== null && (
                <NavLink to="/bookings" className={navLinkClass}>
                  <BookOpen className="h-4 w-4" />
                  <span>My Bookings</span>
                </NavLink>
              )}
              {userName !== null && (
                <NavLink
                  to="/session-prep"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/25"
                        : "text-purple-700 bg-purple-50 hover:bg-purple-100 dark:text-purple-300 dark:bg-purple-950/40 dark:hover:bg-purple-900/50"
                    }`
                  }
                >
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                  <span>AI Session Prep</span>
                </NavLink>
              )}
            </nav>

            {/* Controls (Theme Toggle & Student Auth) */}
            <div className="flex items-center gap-2.5">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600 transition-transform hover:-rotate-12" />
                )}
              </button>

              {/* User Account Controls */}
              {userName === null ? (
                <div className="hidden sm:flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Log In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                      {getInitials(userName)}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                        {userName}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Student
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign Out"
                    aria-label="Sign out"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200/80 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 shadow-lg">
              <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
                <NavLink
                  to="/"
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <Layers className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/tutors"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Tutors</span>
                </NavLink>
                <NavLink
                  to="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Sessions</span>
                </NavLink>
                {userName !== null && (
                  <NavLink
                    to="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={navLinkClass}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>My Bookings</span>
                  </NavLink>
                )}
                {userName !== null && (
                  <NavLink
                    to="/session-prep"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-3.5 py-2 text-sm font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                  >
                    <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
                    <span>AI Session Prep</span>
                  </NavLink>
                )}

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  {userName === null ? (
                    <div className="flex flex-col gap-2">
                      <NavLink
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        Log In
                      </NavLink>
                      <NavLink
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm"
                      >
                        Register
                      </NavLink>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {getInitials(userName)}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {userName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        {/* Academic Footer */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white/50 py-6 text-center text-xs text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Peer Tutoring Platform
              </span>
              <span>&middot;</span>
              <span>ITELECT4 Project</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API Connected
              </span>
              <span>&middot;</span>
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
