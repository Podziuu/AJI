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
import { useEffect, useState } from "react";

const UnfulfilledOrdersTable = ({
  orders,
  showActions,
  selectedStatus = "",
}: {
  orders: Order[];
  showActions?: boolean;
  selectedStatus?: string;
}) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  useEffect(() => {
    let filtered = orders;

    if (selectedStatus) {
      filtered = filtered.filter(
        (order) => order.status.name === selectedStatus
      );
    }

    setFilteredOrders(filtered);
  }, [selectedStatus, orders]);

  // TODO: Implement complete and cancel order functionality

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Created At</TableHead>
          <TableHead>List of Items</TableHead>
          <TableHead>Total Price</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
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
              {showActions && (
                <TableCell>
                  <div className="space-x-6">
                    <Button className="text-xs">Complete</Button>
                    <Button className="text-xs">Cancel</Button>
                  </div>
                </TableCell>
              )}
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
