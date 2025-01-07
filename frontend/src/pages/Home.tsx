import ProductsTable from "@/components/ProductsTable";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products");
        const responseCategories = await apiClient.get("/categories");
        setProducts(response.data);
        setCategories(responseCategories.data);
      } catch (err) {
        console.log("Error fetching products and category", err);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0 || categories.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <h1 className="text-bold text-5xl text-center my-8">List of Products</h1>
      <ProductsTable products={products} categories={categories} />
    </div>
  );
};

export default Home;
