import CheckoutForm from "@/components/CheckoutForm";
import { useStore } from "@/store/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveLeft } from "lucide-react";

const Checkout = () => {
  const { cart } = useStore();

  return (
    <div>
      <MoveLeft
        className="ml-4 mt-4 cursor-pointer"
        onClick={() => window.history.back()}
      />
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
