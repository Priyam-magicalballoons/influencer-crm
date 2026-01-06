import { createBrand, deleteBrand } from "@/app/actions/brand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logoutUser } from "@/lib/helpers";
import { setDataIntoRedis } from "@/redis";
import { useState } from "react";
import { toast } from "sonner";

interface AddBrandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddBrand = ({ onOpenChange, open }: AddBrandProps) => {
  const [brandName, setBrandName] = useState("");
  const handleSubmit = async () => {
    if (!brandName.trim()) {
      return toast.error("Brand name cannot be empty");
    }
    const response = await createBrand(brandName.toUpperCase());
    if (
      response.status === 500 ||
      response.status === 400 ||
      response.status === 403
    ) {
      return toast.error(response.message);
    }

    if (response.status === 401) {
      toast.error(response.message);
      await logoutUser();
    }

    const addToRedis = await setDataIntoRedis("brand", response.data);

    if (addToRedis === "OK") {
      toast.success("Brand Created Successfully");
      onOpenChange(false);
    } else {
      console.log("error");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="CIPLA"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddBrand;
