import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdminTheme } from "../../hooks/use-theme";
import { useAdminGetMe, useAdminLogout } from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  CalendarDays,
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Menu,
  X,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  useAdminTheme(); // Force professional theme
  const [location, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading, error: userError } = useAdminGetMe({
    query: {
      retry: false,
    } as never,
  });
  const logout = useAdminLogout();
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // wouter's `nest` gives relative paths inside /admin, so /admin/login → /login
  const isLoginPage = location === "/login" || location.startsWith("/login?");

  // Redirect if not logged in and not loading
  React.useEffect(() => {
    if (userError && !isLoginPage) {
      // Preserve ?demo=1 so auto-login kicks in after redirect
      const demoParam = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1"
        ? "?demo=1"
        : "";
      // wouter nested context: setLocation is relative to /admin base
      setLocation(`/login${demoParam}`);
    }
  }, [userError, isLoginPage, setLocation]);

  if (isUserLoading) {
    return <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground font-medium">Ładowanie panelu administratora...</p>
    </div>;
  }

  // If login page, don't show layout
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-muted/20">
        {children}
        <Toaster />
      </div>
    );
  }

  // Should have user by now
  if (!user) return null;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Wylogowano pomyślnie" });
        setLocation("/login");
      },
      onError: () => {
        toast({ title: "Błąd podczas wylogowywania", variant: "destructive" });
      }
    });
  };

  // Paths are relative to the /admin nested router base
  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pokoje", label: "Pokoje", icon: BedDouble },
    { href: "/rezerwacje", label: "Rezerwacje", icon: CalendarCheck },
    { href: "/dostepnosc", label: "Dostępność", icon: CalendarDays },
    { href: "/galeria", label: "Galeria", icon: ImageIcon },
    { href: "/aktualnosci", label: "Aktualności", icon: Newspaper },
    { href: "/ustawienia", label: "Ustawienia", icon: Settings },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-1">
      {navItems.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} onClick={onClick}>
            <span className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
              isActive 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b p-4 flex items-center justify-between sticky top-0 z-20">
        <span className="font-serif font-bold text-lg text-primary">Admin Panel</span>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-left-8">
          <div className="p-4 flex items-center justify-between border-b">
            <span className="font-serif font-bold text-xl text-primary">Admin Panel</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <NavLinks onClick={() => setIsMobileOpen(false)} />
          </div>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              Wyloguj się
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r fixed inset-y-0 z-10">
        <div className="p-6 pb-2">
          <h2 className="font-serif text-2xl font-bold text-primary tracking-tight">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">Zarządzanie ośrodkiem</p>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <NavLinks />
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Wyloguj się
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 w-full relative p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      <Toaster />
    </div>
  );
}
