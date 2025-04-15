import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  PARENT_CalendarList_ROUTE, 
  PARENT_MANAGE_RECORDS_ROUTE, 
  PARENT_MANAGE_STUDENT_MOYENNES_ROUTE
} from "../../router";
import { 
  ClipboardList, 
  CalendarDays,
  ChevronRight,
  UserCog,
  BookUser,
  School
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ParentAdministrationSideBar({ className }) {
  const { pathname } = useLocation();

  const navItems = [
    {
      icon: <BookUser className="h-4 w-4" />,
      label: "Your Child's Records",
      path: PARENT_MANAGE_RECORDS_ROUTE,
    },
    {
      icon: <BookUser className="h-4 w-4" />,
      label: "Your Child's courses avg",
      path: PARENT_MANAGE_STUDENT_MOYENNES_ROUTE,
    },
    {
      icon: <CalendarDays className="h-4 w-4" />,
      label: "Your Child's Attendance",
      path: PARENT_CalendarList_ROUTE,
    },
    // Add more items as needed
  ];

  return (
    <div className={cn("hidden lg:block border-r h-full", className)}>
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          <div className="px-4">
            <h2 className="text-lg font-semibold tracking-tight pl-3">
              Parent Dashboard
            </h2>
          </div>
          
          <div className="px-3 py-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link to={item.path} key={item.path}>
                  <Button
                    variant={pathname === item.path ? "secondary" : "ghost"}
                    className="w-full justify-between group"
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-muted-foreground group-hover:text-primary">
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}