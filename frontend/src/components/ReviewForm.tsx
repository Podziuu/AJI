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
} from "@/components/ui/form";
import apiClient from "@/lib/apiClient";
import { useNavigate } from "react-router";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTotalPrice } from "@/lib/utils";
import Rating from "@mui/material/Rating";
import { Textarea } from "./ui/textarea";
import axios from "axios";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string(),
});

const ReviewForm = ({ order }: { order: Order }) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const requestBody = {
      rating: values.rating,
      content: values.content,
      reviewDate: new Date().toISOString(),
    };

    try {
      const response = await apiClient.post(
        `/orders/${order.id}/opinions`,
        requestBody
      );

      const result = response.data;

      if (response.status !== 201) {
        toast({
          title: "Couldnt add review",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      navigate("/clientOrders");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "An unexpected error occurred.";
        toast({
          title: "Couldn’t add review",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Couldn’t add review",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex justify-between gap-20">
      <div className="w-1/2">
        <Table>
          <TableCaption className="">Order details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Created At</TableHead>
              <TableHead>List of Items</TableHead>
              <TableHead>Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={order.id}>
              <TableCell>{order.createdAt.toLocaleString()}</TableCell>
              <TableCell>
                <div>
                  {order.orderItems.map((item) => (
                    <div key={item.id}>
                      {item.product.name} x {item.quantity}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>{getTotalPrice(order.orderItems)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <div className="mb-5">
                    <FormControl>
                      <Rating
                        name="simple-controlled"
                        value={field.value}
                        onChange={(_event, newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="content" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReviewForm;
