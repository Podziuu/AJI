import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

// Create form schema for individual products
const createFormSchema = (allowedCategories: Category[]) => {
  const allowedIds = allowedCategories.map((category) => category.id);

  return z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(10).max(10000),
    categoryId: z.enum(allowedIds as [string, ...string[]]),
    weight: z.number().min(0).max(10000),
    price: z.number().min(0).max(10000),
  });
};

// Create products schema
const createProductsSchema = (allowedCategories: Category[]) => {
  const productSchema = createFormSchema(allowedCategories);
  return z.object({
    Products: z.array(productSchema),
  });
};

const InitMenu = () => {
  const [allowedCategories, setAllowedCategories] = useState<Category[]>([]);
  const [jsonInput, setJsonInput] = useState<string>("");

  const form = useForm<z.infer<ReturnType<typeof createProductsSchema>>>({
    resolver: zodResolver(createProductsSchema(allowedCategories)),
    defaultValues: {
      Products: [], // Initialize with an empty array
    },
  });

  useEffect(() => {
    const fetchAllowedCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        setAllowedCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllowedCategories();
  }, []);

  useEffect(() => {
    if (allowedCategories.length > 0) {
      form.reset(); // Reset form on category change
    }
  }, [allowedCategories, form]);

  const onSubmit = async (data: z.infer<ReturnType<typeof createProductsSchema>>) => {
    try {
      console.log(data); // Handle the submitted data
      // Example API call to save products
      // await apiClient.post("/products", data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value; // Get the input value
    setJsonInput(inputValue); // Update JSON input state

    try {
      const parsedJson = JSON.parse(inputValue); // Try parsing the JSON

      // Check if parsedJson has a Products key and it's an array
      if (Array.isArray(parsedJson.Products)) {
        // Validate against the schema
        const result = createProductsSchema(allowedCategories).safeParse({ Products: parsedJson.Products });

        if (result.success) {
          form.setValue("Products", result.data.Products); // Set parsed data into the form
        } else {
          console.error("Validation errors:", result.error.flatten());
          form.setValue("Products", []); // Reset to empty array if invalid structure
        }
      } else {
        form.setValue("Products", []); // Reset to empty array if invalid structure
      }
    } catch (error) {
      console.error("Invalid JSON:", error);
      form.setValue("Products", []); // Reset to empty array on parsing error
    }
  };

  return (
    <div>
      <p>Initialize products</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="Products"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Products JSON</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste JSON here"
                    className="resize-none h-[500px]"
                    value={jsonInput} // Use the JSON input state
                    onChange={handleJsonChange} // Handle change
                  />
                </FormControl>
                <FormDescription>
                  Please provide a valid JSON array of products.
                </FormDescription>
                <FormMessage /> {/* Render validation messages here */}
              </FormItem>
            )}
          />
          <button type="submit" className="btn">Submit</button>
        </form>
      </Form>
    </div>
  );
};

export default InitMenu;
