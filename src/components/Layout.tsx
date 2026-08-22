import { NavLink, Outlet, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
    isActive
      ? "bg-sky-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;

function Layout() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-dvh overflow-x-hidden bg-[linear-gradient(180deg,#f3f6fb_0%,#eef3f9_100%)] text-slate-900 transition-colors dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-slate-100">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <nav
            aria-label="Primary navigation"
            className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center gap-1.5 px-3 py-3 sm:px-4 xl:px-6"
          >
            <NavLink to="/" end className="mr-2 text-sm font-bold tracking-tight text-slate-950 dark:text-white">
              Peer Tutoring
            </NavLink>
            <NavLink to="/" end className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/tutors" className={navLinkClass}>Tutors</NavLink>
            <NavLink to="/sessions" className={navLinkClass}>Sessions</NavLink>
            <NavLink to="/bookings" className={navLinkClass}>My Bookings</NavLink>
            <div className="ml-auto flex items-center gap-2">
              {userName === null ? (
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Logout ({userName})
                </button>
              )}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus-visible:ring-offset-slate-950"
              >
                {isDarkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </nav>
        </header>
        <main className="px-3 py-3 sm:px-4 xl:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
