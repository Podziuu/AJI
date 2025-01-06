import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { getTotalPrice } from "@/lib/utils";
  import { Button } from "./ui/button";
  
  const UnfulfilledOrdersTable = ({ orders }: { orders: Order[] }) => {
    return (
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Created At</TableHead>
            <TableHead>List of Items</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.createdAt.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div>
                    {order.orderItems.map((item) => (
                      <div key={item.id}>
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getTotalPrice(order.orderItems)}</TableCell>
                <TableCell>
                  <div className="space-x-6">
                    <Button className="text-xs">Complete</Button>
                    <Button className="text-xs">Cancel</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No orders found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };
  
  export default UnfulfilledOrdersTable;
  