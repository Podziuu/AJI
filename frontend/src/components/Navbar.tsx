import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useUserStore } from "@/store";
import { NavLink } from "react-router";
import { Button } from "./ui/button";

const navItems = {
  CLIENT: [
    { path: "/", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/reviews", label: "Reviews" },
  ],
  WORKER: [
    { path: "/", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/reviews", label: "Reviews" },
    { path: "/orders", label: "Orders" },
    { path: "/initialize", label: "Initialize" },
  ],
};

const Navbar = () => {
  const { user } = useUserStore();

  const role = user?.role || "CLIENT";
  const availableNavItems = navItems[role];
  // TODO: Implement logout
  return (
    <NavigationMenu className="border px-4 py-4 rounded-full border-black mx-auto mt-2 space-x-6">
      {availableNavItems.map((item) => (
        <NavigationMenuLink key={item.path} asChild>
          <NavLink to={item.path}>{item.label}</NavLink>
        </NavigationMenuLink>
      ))}
      <Button>Logout</Button>
    </NavigationMenu>
  );
};

export default Navbar;
