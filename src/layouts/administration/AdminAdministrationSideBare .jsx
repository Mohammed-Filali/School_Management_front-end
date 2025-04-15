import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  ADMIN_Calendar_ROUTE, 
  ADMIN_CalendarList_ROUTE, 
  ADMIN_MANAGE_Clases_ROUTE, 
  ADMIN_MANAGE_Cours_ROUTE, 
  ADMIN_MANAGE_PARENTS_ROUTE, 
  ADMIN_MANAGE_STUDENTS_ROUTE, 
  ADMIN_MANAGE_TASKS_ROUTE, 
  ADMIN_MANAGE_TEACHERS_ROUTE, 
  ADMIN_MANAGE_TYPES_ROUTE 
} from "../../router";
import { 
  Users, 
  UserCircle2, 
  UserCog, 
  UserPlus, 
  BookOpen, 
  Calendar, 
  CalendarDays, 
  ListTodo,
  GraduationCap,
  School,
  Type
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function AdminAdministrationSideBare({ className }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: ADMIN_MANAGE_PARENTS_ROUTE,
      icon: UserPlus,
      label: "Parents",
      active: location.pathname === ADMIN_MANAGE_PARENTS_ROUTE
    },
    {
      path: ADMIN_MANAGE_TEACHERS_ROUTE,
      icon: UserCog,
      label: "Teachers",
      active: location.pathname === ADMIN_MANAGE_TEACHERS_ROUTE
    },
    {
      path: ADMIN_MANAGE_TYPES_ROUTE,
      icon: Type,
      label: "Types",
      active: location.pathname === ADMIN_MANAGE_TYPES_ROUTE
    },
    {
      path: ADMIN_MANAGE_STUDENTS_ROUTE,
      icon: GraduationCap,
      label: "Students",
      active: location.pathname === ADMIN_MANAGE_STUDENTS_ROUTE
    },
    {
      path: ADMIN_MANAGE_Clases_ROUTE,
      icon: School,
      label: "Classes",
      active: location.pathname === ADMIN_MANAGE_Clases_ROUTE
    },
    {
      path: ADMIN_MANAGE_Cours_ROUTE,
      icon: BookOpen,
      label: "Courses",
      active: location.pathname === ADMIN_MANAGE_Cours_ROUTE
    },
    {
      path: ADMIN_MANAGE_TASKS_ROUTE,
      icon: ListTodo,
      label: "Tasks",
      active: location.pathname === ADMIN_MANAGE_TASKS_ROUTE
    },
    {
      path: ADMIN_Calendar_ROUTE,
      icon: Calendar,
      label: "Calendar",
      active: location.pathname === ADMIN_Calendar_ROUTE
    },
    {
      path: ADMIN_CalendarList_ROUTE,
      icon: CalendarDays,
      label: "Calendar List",
      active: location.pathname === ADMIN_CalendarList_ROUTE
    }
  ];

  return (
    <motion.div 
      className={cn(
        "pb-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* Collapse Toggle Button */}
          <div className="flex justify-end mb-2 px-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              )}
            </Button>
          </div>

          {!isCollapsed && (
            <motion.h2 
              className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-800 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Administration
            </motion.h2>
          )}
          
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={item.path}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-all duration-200",
                      isCollapsed ? "px-2 justify-center" : "px-4"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4",
                      isCollapsed ? "mr-0" : "mr-2"
                    )} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}