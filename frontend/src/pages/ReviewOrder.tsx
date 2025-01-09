import ReviewForm from "@/components/ReviewForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "react-router";
import NoOrder from "./NoOrder";

const ReviewOrder = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return <NoOrder />;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="w-3/5 h-3/5 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center mb-2">
            Please review your order
          </CardTitle>
          <CardDescription className="text-center mb-10">
            Your opinion helps us improve and provide better service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm order={order} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewOrder;
