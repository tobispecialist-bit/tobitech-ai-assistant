import { useState } from "react";
import { Link } from "wouter";
import { useTheme } from "./ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { 
  BarChart3, 
  Moon, 
  Sun, 
  Bell, 
  Menu,
  Home,
  TrendingUp,
  PieChart,
  Mail
} from "lucide-react";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/visualizations", label: "Visualizations", icon: PieChart },
    { href: "/campaigns", label: "Campaigns", icon: Mail },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white text-sm" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">CreativeData Pro</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors">
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Profile (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName || user?.email}`} />
                <AvatarFallback>
                  {user?.firstName ? user.firstName[0] : user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {/* Profile Info */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName || user?.email}`} />
                      <AvatarFallback>
                        {user?.firstName ? user.firstName[0] : user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a 
                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => window.location.href = "/api/logout"}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
