import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router";

const NoOrder = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full text-center p-4">
        <CardContent>
          <CardTitle className="text-3xl font-bold text-red-500">
            We couldn't find your order
          </CardTitle>
          <CardDescription className="text-lg text-gray-500 mt-4">
            It seems like you don't have any orders yet. Go ahead and place your
            first order!
          </CardDescription>
          <Button
            asChild
            className="mt-8 text-white bg-blue-500 hover:bg-blue-600"
            variant="outline"
          >
            <Link to="/" className="px-6 py-3">
              See our products
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoOrder;
