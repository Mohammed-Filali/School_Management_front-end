import { Link, Outlet, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, PARENT_DUSHBOARD_ROUTE, RedirectRoute } from "../../router";
import { useEffect, useState } from "react";
import { Gauge, Menu } from "lucide-react";
import { ModeToggle } from "../../components/mode-toggle";
import { ParentAdministrationSideBar } from "../Administration/ParentAdministrationSideBar";
import ParentDropDownMenu from "./ParentDropDownMenu";
import { UseUserContext } from "../../context/StudentContext";
import { ParentApi } from "../../service/api/student/admins/parenpApi";
import IGO from '../../assets/Logo.png';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentDashboardLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { authenticated, setUser, setAuthenticated, logout: contextLogout } = UseUserContext();

  useEffect(() => {
    if (authenticated) {
      setIsLoading(false);
      ParentApi.getUser()
        .then(({ data }) => {
          setIsLoading(false);
          const { role } = data;
          if (role !== 'parent') {
            navigate(RedirectRoute(role));
          }
          setUser(data);
          setAuthenticated(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    } else if (!authenticated) {
      setIsLoading(false);
      contextLogout();
      navigate(LOGIN_ROUTE);
    }
  }, [authenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Mobile Sidebar Trigger */}
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <ParentAdministrationSideBar className="flex h-full" />
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link to={PARENT_DUSHBOARD_ROUTE} className="hidden lg:flex items-center">
            <img src={IGO} className="h-10" alt="School Logo" />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link 
              to={PARENT_DUSHBOARD_ROUTE} 
              className="hidden sm:flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <Gauge className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <ParentDropDownMenu />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container grid lg:grid-cols-12 gap-4 px-4 py-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-2">
          <ParentAdministrationSideBar className="h-full" />
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-10">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}