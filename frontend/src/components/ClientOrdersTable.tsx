import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { getTotalPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import ReviewCard from "./ReviewCard";
import { useState } from "react";

const ClientOrdersTable = ({ orders }: { orders: Order[] }) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const navigate = useNavigate();

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
  };

  const AddReviewHandler = (order: Order) => {
    navigate("/review", { state: { order } });
  };

  const ViewReviewHandler = (review: Review) => {
    setSelectedReview(review);
  };

  return (
    <>
      <Table>
        <TableCaption>List of your orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Created At</TableHead>
            <TableHead>List of Items</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Badge className={getBadgeColor(order.status.name)}>
                    {order.status.name}
                  </Badge>
                </TableCell>
                <TableCell>{order.createdAt.toLocaleString()}</TableCell>
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
                  {order.status.name === "CANCELLED" ||
                  order.status.name === "COMPLETED" ? (
                    order.review ? (
                      <ReviewCard review={order.review} orderId={order.id} />
                    ) : (
                      <Button onClick={() => AddReviewHandler(order)}>
                        Add review
                      </Button>
                    )
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="opacity-50 cursor-not-allowed">
                            Add review
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            You can only review cancelled or completed orders
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No orders found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* {selectedReview && (
        <ReviewCard review={selectedReview}/>
    )} */}
    </>
  );
};

export default ClientOrdersTable;
