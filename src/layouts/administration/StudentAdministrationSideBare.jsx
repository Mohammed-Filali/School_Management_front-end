import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  STUDENT_CalendarList_ROUTE,
  STUDENT_MANAGE_MOYENNES_ROUTE,
  STUDENT_MANAGE_RECORDS_ROUTE,
  STUDENT_MANAGE_TASKS_ROUTE,
} from "../../router";
import { Button } from "../../components/ui/button";
import { LayoutDashboardIcon, CalendarIcon, ClipboardListIcon, UsersIcon } from "lucide-react";

export function StudentAdministrationSideBar({ className }) {
  const { pathname } = useLocation();

  const navItems = [
    {
      path: STUDENT_MANAGE_RECORDS_ROUTE,
      icon: <ClipboardListIcon className="mr-3 h-5 w-5" />,
      label: "Your Records",
    },
    {
      path: STUDENT_MANAGE_TASKS_ROUTE,
      icon: <LayoutDashboardIcon className="mr-3 h-5 w-5" />,
      label: "Tasks",
    },
    {
      path: STUDENT_CalendarList_ROUTE,
      icon: <UsersIcon className="mr-3 h-5 w-5" />,
      label: "Absent Students",
    },
    {
      path: STUDENT_MANAGE_MOYENNES_ROUTE,
      icon: <UsersIcon className="mr-3 h-5 w-5" />,
      label: "youre courses avg", 
    },
  ];

  return (
    <div className={cn("h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="flex h-full flex-col">
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold tracking-tight">Student Portal</h2>
          <p className="text-sm text-muted-foreground">Administration dashboard</p>
        </div>

        <div className="flex-1 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link to={item.path} key={item.path} className="block">
                <Button
                  variant={pathname === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start transition-colors hover:bg-accent/50"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Current semester: Spring 2023
          </div>
        </div>
      </div>
    </div>
  );
}