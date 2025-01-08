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
import { Badge } from "@/components/ui/badge"
import apiClient from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";


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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = orders;

    if (selectedStatus) {
      filtered = filtered.filter(
        (order) => order.status.name === selectedStatus
      );
    }

    setFilteredOrders(filtered);
  }, [selectedStatus, orders]);

  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-gray-500";
    }
  }

  const changeOrderStatusHandler = async (orderId : string, status : string ) => {
    const requestBody = {
        op: "replace",
        path: "/status",
        value: status.toUpperCase(),
    };
    try {
      const response = await apiClient.patch(`/orders/${orderId}`, requestBody);
      const result = response.data;
      console.log(response.status)
      if (response.status !== 200) {
        toast({
          title: "Order failed",
          description: result.message,
          variant: "destructive",
        });
      }
      navigate(0);
    }
    catch (err) {
      console.log(err);
    }
  }

  // TODO: Implement complete and cancel order functionality

  return (
    <Table className="table-auto">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
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
              <TableCell>
                <Badge className={getBadgeColor(order.status.name)}>{order.status.name}</Badge>
              </TableCell>
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
                    <Button onClick={() => changeOrderStatusHandler(order.id, "COMPLETED")} className="text-xs">Complete</Button>
                    <Button onClick={() => changeOrderStatusHandler(order.id, "CANCELLED")} className="text-xs">Cancel</Button>
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
