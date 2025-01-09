import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import Rating from "@mui/material/Rating";

const ReviewCard = ({
  review,
  orderId,
}: {
  review: Review;
  orderId: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Review</DialogTitle>
          <DialogDescription className="text-gray-500">
            Order ID: {orderId}
          </DialogDescription>
        </DialogHeader>
        <Label className="text-lg">Rating</Label>
        <Rating name="read-only" value={review.rating} readOnly />
        <Label className="text-lg">Content</Label>
        <div>{review.content}</div>

        <div className="flex justify-center  mt-10">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewCard;
