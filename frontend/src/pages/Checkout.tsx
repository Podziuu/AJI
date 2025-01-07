import CheckoutForm from "@/components/CheckoutForm";
import { useStore } from "@/store/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Checkout = () => {
  const { cart } = useStore();

  return (
    <div>
      <Card className="max-w-[450px] mx-auto mt-24 w-full text-center">
        <CardHeader>
          <CardTitle>Contact info</CardTitle>
          <CardDescription>Please provide your contact info</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckoutForm cart={cart} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
