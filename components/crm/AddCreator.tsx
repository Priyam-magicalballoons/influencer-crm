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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { createUser } from "@/app/actions/creator";
import { setDataIntoRedis } from "@/redis";

interface AddCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCreator = ({ onOpenChange, open }: AddCreatorProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CREATOR" | "ADMIN">("CREATOR");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      return toast.error("Kindly fill all the fields");
    }

    const response = await createUser({ name, email, role });

    if (response.status === 500) {
      return toast.error(response.message);
    }

    const addToRedis = await setDataIntoRedis("creators", response.data);

    if (addToRedis === "OK") {
      toast.success("User Added Successfully");
      onOpenChange(false);
    } else {
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add Creator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="username"
                placeholder="johndoe@mail.com"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "ADMIN" | "CREATOR")}
                required
              >
                <SelectTrigger className="bg-secondary/50 border-border w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {["CREATOR", "ADMIN"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default AddCreator;
