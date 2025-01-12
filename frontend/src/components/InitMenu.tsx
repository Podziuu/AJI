import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

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

const createProductsSchema = (allowedCategories: Category[]) => {
    const productSchema = createFormSchema(allowedCategories);
    return z.object({
        Products: z.array(productSchema),
    });
};

const InitMenu = () => {
  const [allowedCategories, setAllowedCategories] = useState<Category[]>([]);
  const [schema, setSchema] = useState<ReturnType<
    typeof createProductsSchema
  > | null>(null);

  const form = useForm<z.infer<ReturnType<typeof createProductsSchema>>>({
    resolver: zodResolver(createProductsSchema(allowedCategories)),
  });

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

  useEffect(() => {
    if (allowedCategories.length > 0) {
      const newSchema = createProductsSchema(allowedCategories);
      setSchema(newSchema);
      form.reset();
    }
  }, [allowedCategories, form]);

  const onSubmit = async (data: z.infer<ReturnType<typeof createProductsSchema>>) => {
   try {
    console.log(data)
    // const response = await apiClient.put()
   } catch (err) {
    console.log(err)
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
                  className="resize-none"
                  {...field}
                  value={field.value ? JSON.stringify(field.value, null, 2) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                />
                </FormControl>
                <FormDescription>
                  Please provide a valid JSON array of products.
                </FormDescription>
                <FormMessage />
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
