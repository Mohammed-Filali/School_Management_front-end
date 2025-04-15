import { Link, Outlet } from "react-router-dom";
import { Home, Info, LogIn, BookOpen, Menu, X } from "lucide-react";
import { ModeToggle } from "../components/mode-toggle";
import IGO from '../assets/Logo.png';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: <Home className="h-5 w-5" />, label: "Home" },
    { path: "/login", icon: <LogIn className="h-5 w-5" />, label: "Login" },
    { path: "/about", icon: <Info className="h-5 w-5" />, label: "About" },
    { path: "/formations", icon: <BookOpen className="h-5 w-5" />, label: "Formations" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={IGO} 
              className="h-10 object-contain" 
              alt="Company Logo" 
              width={160}
              height={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <ModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <ModeToggle />
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <img 
              src={IGO} 
              className="h-8 object-contain" 
              alt="Company Logo" 
              width={120}
              height={32}
            />
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}