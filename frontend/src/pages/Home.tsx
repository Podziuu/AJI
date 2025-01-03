import ProductsTable from "@/components/ProductsTable";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiClient.get("/products");
      const responseCategories = await apiClient.get("/categories");
      console.log(responseCategories);
      setProducts(response.data);
      setCategories(responseCategories.data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-bold text-5xl text-center my-8">List of Products</h1>
      <ProductsTable products={products} categories={categories} />
    </div>
  );
};

export default Home;
