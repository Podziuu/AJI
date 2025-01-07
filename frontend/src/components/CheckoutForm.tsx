import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import apiClient from "@/lib/apiClient";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\d{9}$/, "Phone number must be exactly 9 digits"),
});

const CheckoutForm = ({ cart }: any) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const requestBody = {
      userId: "96a48b2a-8b59-442d-a6a2-6af92848c6fc",
      statusId: "27fc5aa1-083d-46dc-a2b7-d79dae4c47bb",

      orderItems: cart.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    const response = await apiClient.post("/orders", requestBody); //, {

    const result = response.data;

    console.log(result);

    navigate("/");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="youremail@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutForm;
