import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Boxes,
  ShoppingCart,
  Receipt,
  Users,
  ScrollText,
  BarChart3,
  Sparkles,
  Layers,
  Truck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const overview = [{ title: "Dashboard", url: "/", icon: LayoutDashboard }];

const inventory = [
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Layers },
  { title: "Warehouses", url: "/warehouses", icon: Warehouse },
  { title: "Inventory", url: "/inventory", icon: Boxes },
  { title: "Transfers", url: "/inventory/transfers", icon: Truck },
];

const operations = [
  { title: "Purchases", url: "/purchases", icon: ShoppingCart },
  { title: "Sales", url: "/sales", icon: Receipt },
  { title: "Suppliers & Customers", url: "/contacts", icon: Users },
];

const insights = [
  { title: "Audit Logs", url: "/audit", icon: ScrollText },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const renderItem = (item: { title: string; url: string; icon: any }) => {
    const active = pathname === item.url;
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "hover:bg-sidebar-accent/60"
          }
        >
          <NavLink to={item.url} end>
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg  flex items-center justify-center shadow-glow shrink-0 overflow-hidden">
            <img
              src="./public/inventory_18434326.png"
              alt="Inventory System Logo"
              className="h-6 w-6 object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-sidebar-foreground">
                Stockwise
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Inventory
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Overview</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{overview.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Inventory</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{inventory.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Operations</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{operations.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Insights</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{insights.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-gradient-card p-3 border border-sidebar-border">
            <p className="text-xs font-semibold text-sidebar-foreground">
              Pro tip
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-background rounded text-[10px] border">
                ⌘K
              </kbd>{" "}
              to search anything.
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
