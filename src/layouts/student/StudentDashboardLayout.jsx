import { Link, Outlet, useNavigate } from "react-router-dom";
import { GaugeIcon, Loader2, MenuIcon, XIcon } from "lucide-react";
import StudentDropDownManu from "./StudentDropDown";
import { STUDENT_DUSHBOARD_ROUTE, LOGIN_ROUTE, RedirectRoute } from "../../router";
import { StudentAdministrationSideBar } from "../administration/StudentAdministrationSideBare";
import { ModeToggle } from "../../components/mode-toggle";
import { useEffect, useState } from "react";
import { UseUserContext } from "../../context/StudentContext";
import { StudentApi } from "../../service/api/student/studentApi";
import IGO from '../../assets/Logo.png';

export default function StudentDashboardLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authenticated, setUser, setAuthenticated, logout: contextLogout } = UseUserContext();

  useEffect(() => {
    if (authenticated) {
      StudentApi.getUser()
        .then(({ data }) => {
          setIsLoading(false);
          const { role } = data;
          if (role !== 'student') {
            navigate(RedirectRoute(role));
          }
          setUser(data);
          setAuthenticated(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          setIsLoading(false);
          contextLogout();
          navigate(LOGIN_ROUTE);
        });
    } else {
      setIsLoading(false);
      contextLogout();
      navigate(LOGIN_ROUTE);
    }
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
          {/* Mobile menu button and logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-muted-foreground"
            >
              {sidebarOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
            <img 
              src={IGO} 
              className="h-10 w-auto" 
              alt="School Logo" 
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link 
              to={STUDENT_DUSHBOARD_ROUTE} 
              className="hidden sm:flex items-center text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              <GaugeIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <StudentDropDownManu />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container flex flex-col md:flex-row gap-4 py-6 px-4">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Mobile and Desktop */}
          <div className={`fixed md:relative z-50 md:z-auto w-64 h-full transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'left-0' : '-left-64'} md:left-0`}
          >
            <div className="h-full bg-background border-r">
              <StudentAdministrationSideBar />
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 pt-4 md:pt-0">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Your School Name. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}