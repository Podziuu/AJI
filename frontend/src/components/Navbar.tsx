import {
    NavigationMenu,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu"
import { Link } from "react-router";

const Navbar = () => {
  return (
    <NavigationMenu className="border px-4 py-4 rounded-full border-black mx-auto mt-2">
      <Link to="/">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Products
        </NavigationMenuLink>
      </Link>
      <Link to="/orders">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Orders
        </NavigationMenuLink>
      </Link>
      <Link to="/initialize">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Initialize
        </NavigationMenuLink>
      </Link>
      <Link to="/reviews">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Reviews
        </NavigationMenuLink>
      </Link>
      <Link to="/cart">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Cart
        </NavigationMenuLink>
      </Link>
    </NavigationMenu>
  );
};

export default Navbar;
