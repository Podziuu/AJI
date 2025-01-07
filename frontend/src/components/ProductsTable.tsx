import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { Button } from "./ui/button";
import { useStore, useUserStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";

const ProductsTable = ({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { addToCart } = useStore();
  const { toast } = useToast();
  const { user } = useUserStore();
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category.name === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const clickHandler = (product: Product) => {
    addToCart(product);
    toast({ title: "Product added to cart" });
  };

  const editProduct = (id: string) => {
    console.log(id);
    navigate("/products/edit/" + id);
  };

  return (
    <div className="p-8">
      <div className="space-y-4 flex items-center space-x-16">
        <div className="space-y-2">
          <Label>Search by name</Label>
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Dropdown
          label="Category"
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <Table>
        <TableCaption>A list of products you can buy!</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Add to cart</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                onClick={
                  user?.role === "WORKER"
                    ? () => editProduct(product.id)
                    : undefined
                }
                className={`${user?.role === "WORKER" ? "cursor-pointer" : ""}`}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.weight}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  <Button onClick={() => clickHandler(product)}>
                    Add to cart
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No products found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
