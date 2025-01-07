import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router";

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full text-center p-4">
        <CardContent>
          <CardTitle className="text-3xl font-bold text-red-500">
            Unauthorized
          </CardTitle>
          <CardDescription className="text-lg text-gray-500 mt-4">
            You do not have permission to view this page. Please contact support
            if you believe this is an error.
          </CardDescription>
          <Button
            asChild
            className="mt-8 text-white bg-blue-500 hover:bg-blue-600"
            variant="outline"
          >
            <Link to="/" className="px-6 py-3">
              Go to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
