import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner"

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

<<<<<<< HEAD
// Create products schema
const createProductsSchema = (allowedCategories: Category[]) => {
  const productSchema = createFormSchema(allowedCategories);
  return z.object({
    Products: z.array(productSchema),
=======
const createProductsSchema = () => {
  return z.object({
    Products: z.string().refine((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return false;
        return true;
      } catch {
        return false;
      }
    }, "Invalid JSON array format"),
>>>>>>> b126e443d4ebd4151f7f8fb97e3789ca6a8a49ec
  });
};

const InitMenu = () => {
  const [allowedCategories, setAllowedCategories] = useState<Category[]>([]);
<<<<<<< HEAD
  const [jsonInput, setJsonInput] = useState<string>("");

  const form = useForm<z.infer<ReturnType<typeof createProductsSchema>>>({
    resolver: zodResolver(createProductsSchema(allowedCategories)),
    defaultValues: {
      Products: [], // Initialize with an empty array
=======

  const form = useForm<z.infer<ReturnType<typeof createProductsSchema>>>({
    resolver: zodResolver(createProductsSchema()),
    defaultValues: {
      Products: "",
>>>>>>> b126e443d4ebd4151f7f8fb97e3789ca6a8a49ec
    },
  });

  const handleValidationErrors = (error: any) => {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        toast("Validation error", {
          description: `Field "${err.path.join(".")}": ${err.message}`,
          duration: 5000,
        })
      });
    } else {
      toast("Validation error", {
        description: error.message,
        duration: 5000,
      })
    }
  };

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

<<<<<<< HEAD
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
=======
  const onSubmit = async (
    data: z.infer<ReturnType<typeof createProductsSchema>>
  ) => {
    try {
      console.log(data);
      const parsed = JSON.parse(data.Products);
      console.log(parsed);
      const productSchema = createFormSchema(allowedCategories);
      parsed.forEach((product: any) => productSchema.parse(product));
      // TODO send data to backend
      // const response = await apiClient.put()
    } catch (err) {
      console.log(err);
      handleValidationErrors(err);
    }
>>>>>>> b126e443d4ebd4151f7f8fb97e3789ca6a8a49ec
  };

  return (
    <div className="p-8">
      <h2>Initialize products</h2>
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
<<<<<<< HEAD
                    className="resize-none h-[500px]"
                    value={jsonInput} // Use the JSON input state
                    onChange={handleJsonChange} // Handle change
=======
                    className="resize-none h-72"
                    {...field}
>>>>>>> b126e443d4ebd4151f7f8fb97e3789ca6a8a49ec
                  />
                </FormControl>
                <FormDescription>
                  Please provide a valid JSON array of products.
                </FormDescription>
                <FormMessage /> {/* Render validation messages here */}
              </FormItem>
            )}
          />
          <Button type="submit" className="btn">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InitMenu;
