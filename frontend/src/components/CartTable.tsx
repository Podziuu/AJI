import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Button } from './ui/button';
import { useStore } from "@/store/index";
import { useNavigate } from 'react-router';



export const CartTable = ({cart} : any) => {
    //@ts-ignore
    const { addToCart, reduceQuantity, removeFromCart } = useStore();
    const navigate = useNavigate();

    const plusClickHandler = (product : any) => {
        addToCart(product);
    }

    const minusClickHandler = (product : any) => {
        reduceQuantity(product);
    }

    const removeClickHandler = (product : any) => {
        removeFromCart(product);
    }

    const calculateTotalPrice = cart.reduce((sum : number, product : any) => sum + product.price * product.quantity, 0);

    const checkoutHandler = () => {
        navigate("/checkout")
    }

  return (
    <div>
        <Table>
        <TableCaption>Your cart</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead></TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead></TableHead>
            <TableHead>Sum</TableHead>
            <TableHead>Remove product</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.length > 0 ? (
            <>
            {cart.map((product : any) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                    <Button onClick={() => minusClickHandler(product)}> -</Button>
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                    <Button onClick={() => plusClickHandler(product)}>+</Button>
                </TableCell>
                <TableCell>{product.price * product.quantity}</TableCell>
                <TableCell>
                    <Button onClick={() => removeClickHandler(product)}> Remove </Button>
                </TableCell>
              </TableRow>
            ))}
                <TableRow>
                    <TableCell>Total price</TableCell>
                    <TableCell>{calculateTotalPrice}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'right' }}>
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
  )
}
