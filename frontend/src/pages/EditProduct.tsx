import EditProductForm from "@/components/EditProductForm";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="flex flex-col">
      {product ? (
        <>
          <Navbar />
          <Card className="max-w-[450px] mx-auto mt-10 w-full text-center">
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <EditProductForm product={product} />
            </CardContent>
          </Card>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EditProduct;
