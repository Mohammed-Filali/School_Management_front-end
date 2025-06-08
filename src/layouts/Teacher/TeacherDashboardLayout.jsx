import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseUserContext } from "../../context/StudentContext.jsx";
import { Gauge, Menu, X, Loader2 } from "lucide-react";
import { ModeToggle } from "../../components/mode-toggle.jsx";
import { LOGIN_ROUTE, RedirectRoute, TEACHER_DASHBOARD_ROUTE } from "../../router/index.jsx";
import TeacherDropDownMenu from "./TeacherDropDownMenu.jsx";
import { TeacherApi } from "../../service/api/student/teacherApi.js";
import IGO from '../../assets/Logo.png';
import { TeacherAdministrationSideBar } from "../administration/TeacherAdministrationSideBar.jsx";

export default function TeacherDashboardLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { authenticated, setUser, setAuthenticated, logout: contextLogout } = UseUserContext();

  useEffect(() => {
    const fetchUserData = async () => {
      if (authenticated) {
        try {
          const { data } = await TeacherApi.getUser();
          const { role } = data;
          
          if (role !== 'teacher') {
            navigate(RedirectRoute(role));
            return;
          }
          
          setUser(data);
          setAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          contextLogout();
          navigate(LOGIN_ROUTE);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        contextLogout();
        navigate(LOGIN_ROUTE);
      }
    };

    fetchUserData();
  }, [authenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-2 p-2 rounded-md text-foreground/70"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            
            <Link to={TEACHER_DASHBOARD_ROUTE} className="flex items-center gap-2">
              <img src={IGO} className="h-10" alt="Institution Logo" />
            </Link>
          </div>

          <nav className="flex items-center gap-4">
            <Link 
              to={TEACHER_DASHBOARD_ROUTE} 
              className="hidden sm:flex items-center text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              <Gauge className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            
            <ModeToggle />
            <TeacherDropDownMenu />
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto py-6 px-4">
          <TeacherAdministrationSideBar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container grid lg:grid-cols-5">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block lg:col-span-1 border-r py-6 pr-4">
          <TeacherAdministrationSideBar className="sticky top-20" />
        </aside>

        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-4 py-6 pl-0 lg:pl-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}