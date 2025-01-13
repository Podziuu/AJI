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
        const respone = await apiClient.get("/categories");
        setAllowedCategories(respone.data);
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
          <Button type="submit" className="btn">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InitMenu;
