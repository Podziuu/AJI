import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      Sorry you're aunathorized to view this page 😢{" "}
      <Link to="/" className="text-blue-700">
        Come back to home page
      </Link>
    </div>
  );
};

export default Unauthorized;
