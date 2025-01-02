import RegisterForm from "@/components/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card >
        <CardHeader>
          <CardTitle className="text-center">Create a new account</CardTitle>
          <CardDescription>Please enter your email and password to create a new account in our shop</CardDescription>
        </CardHeader>
        <CardContent >
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center">
          <Link to="/login">Already have an account? <span className="text-blue-700">Login</span></Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
