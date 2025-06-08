import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TEACHER_Calendar_ROUTE,
  TEACHER_CalendarList_ROUTE,
  TEACHER_MANAGE_EXAMS_route,
  TEACHER_MANAGE_RECORDS_ROUTE,
  TEACHER_MANAGE_TASKS_ROUTE,
  TEACHER_TOTAL_RECORDS_ROUTE,
} from "../../router";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  ClipboardList,
  FileText,
  PenSquare,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { useEffect } from "react";

export function TeacherAdministrationSideBar({ className }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
  
    }, [navigate])
  const routes = [
    {
      path: TEACHER_MANAGE_EXAMS_route,
      name: "Exams",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      path: TEACHER_MANAGE_RECORDS_ROUTE,
      name: "Records",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      path: TEACHER_MANAGE_TASKS_ROUTE,
      name: "Tasks",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
    },
    {
      path: TEACHER_Calendar_ROUTE,
      name: "Calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      path: TEACHER_CalendarList_ROUTE,
      name: "Calendar List",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      path: TEACHER_TOTAL_RECORDS_ROUTE,
      name: "Total Records",
      icon: <PenSquare className="mr-2 h-4 w-4" />,
    },
    
  ];

  return (
    <div className={cn("h-full border-r bg-background pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Administration
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link to={route.path} key={route.path}>
                <Button
                onClick={() => navigate(route.path)}
                  variant={
                    pathname === route.path ? "secondary" : "ghost"
                  }
                  className="w-full justify-start transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  {route.icon}
                  {route.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}