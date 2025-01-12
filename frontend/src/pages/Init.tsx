import InitMenu from "@/components/InitMenu";
import Navbar from "@/components/Navbar";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
const Init = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="h-screen">
      <Navbar />
      {products.length !== 0 ? (
          <InitMenu/>
      ) : (
        <div className="mt-60">
        <p className="text-xl text-center font-bold">Products are already in database</p>
      </div>
      )}
    </div>
  );
};

export default Init;
