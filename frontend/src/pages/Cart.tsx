import { CartTable } from "@/components/CartTable";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/index";

const Cart = () => {
  const { cart } = useStore();
  return (
    <div>
      <Navbar />
      <CartTable cart={cart} />
    </div>
  );
};

export default Cart;
