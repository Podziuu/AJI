import CheckoutForm from "@/components/CheckoutForm";
import { useStore } from "@/store/index";

const Checkout = () => {
  const { cart } = useStore();

  return (
    <div>
      <CheckoutForm cart={cart} />
    </div>
  );
};

export default Checkout;
