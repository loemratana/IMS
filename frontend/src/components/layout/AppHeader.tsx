import { Bell, Search, Moon, Sun, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authService from "@/services/authService";

export function AppHeader() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const { data: meResponse } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    staleTime: 5 * 60 * 1000,
  });
  const user = meResponse?.data?.user ?? meResponse?.data ?? null;

  function getInitials(name?: string) {
    if (!name) return 'U';
    return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, orders, suppliers..."
            className="pl-9 h-9 bg-secondary/60 border-transparent focus-visible:bg-card"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline text-[10px] text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1 md:flex-none" />

      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-sm hidden sm:inline-flex">
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[9px] bg-destructive text-destructive-foreground border-2 border-card">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">Low stock alert</span>
              <span className="text-xs text-muted-foreground">SKU-2384 below threshold</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">PO #4421 approved</span>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">New supplier added</span>
              <span className="text-xs text-muted-foreground">Acme Logistics</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-secondary transition-smooth">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold">{user?.name ?? 'Loading…'}</span>
                <span className="text-[10px] text-muted-foreground">{user?.role ?? '…'}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => navigate("/logout")}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
