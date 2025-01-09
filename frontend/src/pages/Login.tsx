import LoginForm from "@/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login to your account!</CardTitle>
          <CardDescription>
            Please enter your email and password to start shopping!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center">
          <Link to="/register">
            Doesn't have an account?{" "}
            <span className="text-blue-700">Register</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
