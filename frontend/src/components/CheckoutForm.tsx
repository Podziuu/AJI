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
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store";
import { useUserStore } from "@/store";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\d{9}$/, "Phone number must be exactly 9 digits"),
});

const CheckoutForm = ({ cart }: any) => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  // @ts-ignore
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (user?.id) {
      const requestBody = {
        userId: user.id,
        statusId: "27fc5aa1-083d-46dc-a2b7-d79dae4c47bb",

        orderItems: cart.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      try {
        const response = await apiClient.post("/orders", requestBody);

        const result = response.data;

        if (response.status !== 201) {
          toast({
            title: "Order failed",
            description: result.message,
            variant: "destructive",
          });
        }

      clearCart();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-left"
      >
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

        <div className="flex justify-center">
          <Button type="submit" className="">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
