import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useStore } from "@/store/index";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";

export const CartTable = ({ cart }: { cart: Product[] }) => {
  const { addToCart, reduceQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const { toast } = useToast();
  const plusClickHandler = (product: Product) => {
    addToCart(product);
  };

  const minusClickHandler = (product: Product) => {
    reduceQuantity(product);
  };

  const removeClickHandler = (product: Product) => {
    removeFromCart(product);
    toast({ title: "Product removed from cart" });
  };

  const calculateTotalPrice = cart.reduce(
    (sum: number, product: Product) =>
      sum + product.price * (product.quantity || 1),
    0
  );

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  return (
    <div>
      <Table>
        <TableCaption>Your cart</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Sum</TableHead>
            <TableHead>Remove product</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.length > 0 ? (
            <>
              {cart.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        className="p-3 py-0 h-fit"
                        onClick={() => minusClickHandler(product)}
                      >
                        {" "}
                        -
                      </Button>
                      <span>{product.quantity}</span>
                      <Button
                        className="p-3 py-0 h-fit"
                        onClick={() => plusClickHandler(product)}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.price * (product.quantity || 1)}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => removeClickHandler(product)}>
                      {" "}
                      Remove{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total price</TableCell>
                <TableCell>{calculateTotalPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "right" }}>
                  <Button onClick={() => checkoutHandler()} className="mt-4">
                    Proceed to Checkout
                  </Button>
                </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={7}>No products found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
