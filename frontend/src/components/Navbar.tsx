import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useUserStore } from "@/store";
import { NavLink } from "react-router";
import { Button } from "./ui/button";
import apiClient from "@/lib/apiClient";
import { useNavigate } from "react-router";

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
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();

  const clickHandler = async () => {
    await apiClient.post("/auth/logout");
    clearUser();
    navigate("/login");
  };

  const role = user?.role || "CLIENT";
  const availableNavItems = navItems[role];
  return (
    <NavigationMenu className="border px-4 py-4 rounded-full border-black mx-auto mt-2 space-x-6">
      {availableNavItems.map((item) => (
        <NavigationMenuLink key={item.path} asChild>
          <NavLink to={item.path}>{item.label}</NavLink>
        </NavigationMenuLink>
      ))}
      <Button onClick={clickHandler}>Logout</Button>
    </NavigationMenu>
  );
};

export default Navbar;
