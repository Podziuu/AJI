import ProductsTable from "@/components/ProductsTable";
import { useEffect } from "react";
import apiClient from "@/lib/apiClient";

const Home = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiClient.get("/products");
      console.log(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      Home
      <ProductsTable />
    </div>
  );
};

export default Home;
