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
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-none shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
            <DropdownMenuLabel className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="font-black tracking-tight">Notifications</span>
              </div>
              <Badge className="bg-white/20 text-white border-none text-[10px] font-bold">3 New</Badge>
            </DropdownMenuLabel>
            <div className="max-h-[350px] overflow-y-auto bg-card">
              <DropdownMenuItem className="p-4 border-b border-border/50 flex flex-col items-start gap-1 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 w-full">
                  <Badge className="bg-rose-500 h-2 w-2 rounded-full p-0" />
                  <span className="text-xs font-bold text-foreground">Critical Stock Alert</span>
                  <span className="text-[10px] font-medium text-muted-foreground ml-auto">2m ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">High-Performance GPU has dropped below the threshold (2 left).</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 border-b border-border/50 flex flex-col items-start gap-1 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 w-full">
                  <Badge className="bg-amber-500 h-2 w-2 rounded-full p-0" />
                  <span className="text-xs font-bold text-foreground">Low Stock Warning</span>
                  <span className="text-[10px] font-medium text-muted-foreground ml-auto">45m ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Wireless Mouse stock is currently at 12 units.</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 border-b border-border/50 flex flex-col items-start gap-1 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 w-full">
                  <Badge className="bg-blue-500 h-2 w-2 rounded-full p-0" />
                  <span className="text-xs font-bold text-foreground">Daily Report Sent</span>
                  <span className="text-[10px] font-medium text-muted-foreground ml-auto">8h ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">System summary successfully delivered to admin@enterprise.com.</p>
              </DropdownMenuItem>
            </div>
            <div className="p-2 bg-muted/30">
              <Button 
                variant="ghost" 
                className="w-full text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 py-2 h-auto rounded-xl"
                onClick={() => navigate('/alerts/notifications')}
              >
                View All Activity Logs
              </Button>
            </div>
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
