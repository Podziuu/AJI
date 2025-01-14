import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
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
import { toast } from "sonner";

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
  });
};

const InitMenu = () => {
  const [allowedCategories, setAllowedCategories] = useState<Category[]>([]);

  const form = useForm<z.infer<ReturnType<typeof createProductsSchema>>>({
    resolver: zodResolver(createProductsSchema()),
    defaultValues: {
      Products: "",
    },
  });

  const handleValidationErrors = (error: ZodError | Error) => {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        toast("Validation error", {
          description: `Field "${err.path.join(".")}": ${err.message}`,
          duration: 5000,
        });
      });
    } else {
      toast("Validation error", {
        description: error.message,
        duration: 5000,
      });
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

  const onSubmit = async (
    data: z.infer<ReturnType<typeof createProductsSchema>>
  ) => {
    try {
      const parsed = JSON.parse(data.Products);
      const productSchema = createFormSchema(allowedCategories);
      parsed.forEach((product: Product) => productSchema.parse(product));

      await apiClient.post("/init", parsed);
      toast.success("Products loaded successfully!");
    } catch (err) {
      if (err instanceof Error || err instanceof ZodError) {
        handleValidationErrors(err);
      } else {
        console.log("Unkown error:", err);
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-center text-xl mb-5">Initialize products</h2>
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
                    className="resize-none h-72"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please provide a valid JSON array of products.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="btn mt-5">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InitMenu;
