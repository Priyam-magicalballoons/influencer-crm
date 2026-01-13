"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Influencer,
  influencerTypes,
  paymentStatuses,
  InfluencerType,
  PaymentStatus,
  BrandNames,
} from "@/lib/types";
import { getDataFromRedis } from "@/redis";
import { toast } from "sonner";
import { format, parse } from "date-fns";
// import { handleNumberStep } from "@/lib/helpers";

interface AddInfluencerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (influencer: Omit<Influencer, "id" | "srNo">) => void;
  onEdit?: (influencer: Influencer) => void;
  editingInfluencer?: Influencer | null;
  role: "ADMIN" | "CREATOR";
}

const initialFormState = {
  name: "",
  profile: "",
  followers: "",
  type: "" as InfluencerType | "",
  email: "",
  number: "",
  payout: 0,
  product_amount: 0,
  total_amount: 0,
  order_date: "",
  receive_date: "",
  published_date: "",
  reel_link: "",
  mail_status: "Pending",
  photo: "",
  review: "",
  views: "",
  likes: "",
  comments: "",
  payment_date: "",
  gpay_number: "",
  payment_status: "Pending" as PaymentStatus | "",
  payment_done: "",
  creator_id: "",
  created_at: "",
  brand_name: "",
  approval_required: "",
  ask_price: null,
  approval_status: "",
  approval_comment: "",
} as Influencer;

export function AddInfluencerDialog({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  editingInfluencer,
  role,
}: AddInfluencerDialogProps) {
  const [form, setForm] = useState(initialFormState);
  const isEditMode = !!editingInfluencer;
  const [brands, setBrands] = useState<any[]>([]);

  const getBrands = async () => {
    const data = await getDataFromRedis("brand");
    setBrands(data as any);
  };
  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    if (editingInfluencer) {
      setForm({
        name: editingInfluencer.name,
        profile: editingInfluencer.profile,
        followers: editingInfluencer.followers || "",
        type: editingInfluencer.type,
        email: editingInfluencer.email || "",
        contact: editingInfluencer.contact || "",
        payout: editingInfluencer.payout || 0,
        product_amount: editingInfluencer.product_amount || 0,
        total_amount: editingInfluencer.total_amount || 0,
        order_date: editingInfluencer.order_date ?? "",
        receive_date: editingInfluencer.receive_date ?? "",
        published_date: editingInfluencer.published_date ?? "",
        reel_link: editingInfluencer.reel_link || "",
        mail_status: editingInfluencer.mail_status || "",
        photo: editingInfluencer.photo || "",
        review: editingInfluencer.review || "",
        views: editingInfluencer.views || "",
        likes: editingInfluencer.likes || "",
        comments: editingInfluencer.comments || "",
        payment_date: editingInfluencer.payment_date ?? "",
        gpay_number: editingInfluencer.gpay_number || "",
        payment_status: editingInfluencer.payment_status,
        payment_done: editingInfluencer.payment_done ?? "",
        brand_name: editingInfluencer.brand_name,
        created_at: editingInfluencer.created_at,
        creator_id: editingInfluencer.creator_id,
        approval_required: editingInfluencer.approval_required || "",
        ask_price: editingInfluencer.ask_price || null,
        approval_comment: editingInfluencer.approval_comment || "",
        approval_status: editingInfluencer.approval_status || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [editingInfluencer, open]);

  // console.log(form);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.profile || !form.type || !form.brand_name) {
      return toast.error("Name, Profile, Type, Brand name is required");
    }

    const influencerData: Omit<Influencer, "id" | "creator_name"> = {
      name: form.name,
      profile: form.profile,
      followers: form.followers || "0",
      type: (form.type as InfluencerType) || "Nano (1K-10K)",
      email: form.email || "",
      contact: form.contact || "",
      payout: Number(form.payout) || 0,
      product_amount: Number(form.product_amount) || 0,
      total_amount: Number(form.payout) + Number(form.product_amount),
      order_date: form.order_date || "",
      receive_date: form.receive_date || "",
      published_date: form.published_date || "",
      reel_link: form.reel_link || "",
      mail_status: form.mail_status,
      photo: form.photo || "",
      review: form.review || "",
      views: form.views || "0",
      likes: form.likes || "0",
      comments: form.comments || "0",
      payment_date: form.payment_date || "",
      gpay_number: form.gpay_number || "",
      payment_status: (form.payment_status as PaymentStatus) || "Pending",
      payment_done: form.payment_done || "",
      creator_id: form.creator_id || "",
      created_at: form.created_at || "",
      brand_name: form.brand_name || "",
      approval_required: form.approval_required || "",
      ask_price: form.ask_price || null,
      approval_status: form.approval_status || "",
      approval_comment: form.approval_comment || "",
    };

    if (isEditMode && onEdit && editingInfluencer) {
      onEdit({
        ...influencerData,
        id: editingInfluencer.id,
        creator_name: editingInfluencer.creator_name,
      });
    } else {
      onAdd(influencerData);
    }

    setForm(initialFormState);
    onOpenChange(false);
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  type StepHandlerArgs = {
    event: React.KeyboardEvent<HTMLInputElement>;
    value: string | number;
    step: number;
    onChange: (nextValue: string) => void;
  };

  function handleNumberStep({ event, value, step, onChange }: StepHandlerArgs) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    event.preventDefault();

    const current =
      value === "" || Number.isNaN(Number(value)) ? 0 : Number(value);

    const next =
      event.key === "ArrowUp"
        ? current + step
        : current - step < 0
        ? current
        : current - step;

    onChange(String(next));
  }

  const getFormattedDate = (date: string) => {
    const d = new Date(date);

    const formatted =
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0");
    return formatted;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEditMode ? "Edit Influencer" : "Add New Influencer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  className="bg-secondary/50 border-border"
                  placeholder="Influencer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile">Profile Link *</Label>
                <Input
                  id="profile"
                  type="url"
                  value={form.profile}
                  onChange={(e) => updateField("profile", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="bg-secondary/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers">Followers</Label>
                <Input
                  id="followers"
                  value={form.followers ?? ""}
                  onChange={(e) =>
                    updateField("followers", e.target.value || "")
                  }
                  // onKeyDown={(e) =>
                  //   handleNumberStep({
                  //     event: e,
                  //     step: 100,
                  //     value: form.followers || "",
                  //     onChange: (v) => updateField("followers", v),
                  //   })
                  // }
                  className="bg-secondary/50 border-border"
                  placeholder="Enter followers number"
                  formNoValidate
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type of Influencer *</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => updateField("type", value)}
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {influencerTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Enter Email Id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) => updateField("contact", e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Enter Contact Number"
                />
              </div>
            </div>
          </div>

          {/* Brand Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Brand Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_name">Name Of Brand</Label>
                <Select
                  value={form.brand_name}
                  onValueChange={(value) => updateField("brand_name", value)}
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Financial Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payout">Payout (₹)</Label>
                <Input
                  id="payout"
                  type="number"
                  value={form.payout}
                  onChange={(e) => {
                    updateField("payout", e.target.value);
                  }}
                  className="bg-secondary/50 border-border"
                  step={100}
                  min={0}
                  onInvalid={(e) => e.preventDefault()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_amount">Product Amount (₹)</Label>
                <Input
                  id="product_amount"
                  type="number"
                  value={form.product_amount}
                  onChange={(e) =>
                    updateField("product_amount", e.target.value)
                  }
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount (₹)</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={Number(form.payout) + Number(form.product_amount)}
                  onChange={(e) => updateField("total_amount", e.target.value)}
                  className="bg-secondary/50 border-border"
                  readOnly
                />
              </div>
            </div>
          </div>
          {/*  Approval Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Approval Required
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="approval_required">Approval Required ?</Label>
                <Select
                  value={form.approval_required}
                  onValueChange={(value) =>
                    updateField("approval_required", value)
                  }
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border w-full">
                    <SelectValue placeholder="Select Approval Requirement" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {["YES", "NO"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.approval_required === "YES" && (
                <div className="space-y-2">
                  <Label htmlFor="ask_price">Ask Price (₹)</Label>
                  <Input
                    id="ask_price"
                    type="number"
                    value={form.ask_price!}
                    onChange={(e) => updateField("ask_price", e.target.value)}
                    className="bg-secondary/50 border-border"
                    min={0}
                  />
                </div>
              )}

              {role === "ADMIN" && (
                <div className="space-y-2">
                  <Label htmlFor="approval_status">Approval Status</Label>
                  <Select
                    value={form.approval_status}
                    onValueChange={(value) =>
                      updateField("approval_status", value)
                    }
                    required
                  >
                    <SelectTrigger className="bg-secondary/50 border-border w-full">
                      <SelectValue placeholder="Select Approval Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {["YES", "NO", "OTHER"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {form.approval_status === "OTHER" && role === "ADMIN" && (
              <div className="space-y-2">
                <Label htmlFor="approval_comment">Approval Comment</Label>
                <Textarea
                  id="approval_comment"
                  value={form.approval_comment}
                  onChange={(e) =>
                    updateField("approval_comment", e.target.value)
                  }
                  placeholder="Enter Approval Comment..."
                  className="bg-secondary/50 border-border resize-none w-full"
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Important Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_date">Order Date</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={
                    (form.order_date as any) instanceof Date
                      ? getFormattedDate(form.order_date as string)
                      : ""
                  }
                  onChange={(e) =>
                    updateField(
                      "order_date",
                      (new Date(e.target.value) as any) || ""
                    )
                  }
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receive_date">Receive Date</Label>
                <Input
                  id="receive_date"
                  type="date"
                  value={
                    (form.receive_date as any) instanceof Date
                      ? getFormattedDate(form.receive_date as string)
                      : ""
                  }
                  onChange={(e) =>
                    updateField(
                      "receive_date",
                      (new Date(e.target.value) as any) || ""
                    )
                  }
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_date">Published Reel Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={
                    (form.published_date as any) instanceof Date
                      ? getFormattedDate(form.published_date as string)
                      : ""
                  }
                  onChange={(e) =>
                    updateField(
                      "published_date",
                      (new Date(e.target.value) as any) || ""
                    )
                  }
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
          </div>

          {/* Content & Engagement */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Content & Engagement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mail_status">Mail Sent</Label>
                <Select
                  value={form.mail_status}
                  onValueChange={(value) => updateField("mail_status", value)}
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border w-full">
                    <SelectValue placeholder="Select Mail Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {["Sent", "Pending"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reel_link">Reel Link</Label>
                <Input
                  id="reel_link"
                  type="url"
                  value={form.reel_link}
                  onChange={(e) => updateField("reel_link", e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Enter Reel Link"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <Select
                  value={form.photo}
                  onValueChange={(value) => updateField("photo", value)}
                >
                  <SelectTrigger className="bg-secondary/50 border-border w-full">
                    <SelectValue placeholder="Select Approval" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {["YES", "NO"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  value={form.views || ""}
                  onChange={(e) => updateField("views", e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Enter views"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  type="number"
                  value={form.likes || ""}
                  onChange={(e) => updateField("likes", e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Enter likes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  type="number"
                  value={form.comments || ""}
                  onChange={(e) => updateField("comments", e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Enter comments"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Select
                value={form.review}
                onValueChange={(value) => updateField("review", value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border ">
                  <SelectValue placeholder="Select Review" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {["YES", "NO"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_date">Payment Date</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={
                    (form.payment_date as any) instanceof Date
                      ? getFormattedDate(form.payment_date as string)
                      : ""
                  }
                  onChange={(e) =>
                    updateField(
                      "payment_date",
                      (new Date(e.target.value) as any) || ""
                    )
                  }
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpay_number">GPay Number</Label>
                <Input
                  id="gpay_number"
                  placeholder="+91 123456789"
                  value={form.gpay_number}
                  onChange={(e) => updateField("gpay_number", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select
                  value={form.payment_status}
                  onValueChange={(value) =>
                    updateField("payment_status", value)
                  }
                >
                  <SelectTrigger className="bg-secondary/50 border-border w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_done">Payment Done Date</Label>
                <Input
                  id="payment_done"
                  type="date"
                  value={
                    (form.payment_done as any) instanceof Date
                      ? getFormattedDate(form.payment_done as string)
                      : ""
                  }
                  onChange={(e) =>
                    updateField(
                      "payment_done",
                      (new Date(e.target.value) as any) || ""
                    )
                  }
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {isEditMode ? "Save Changes" : "Add Influencer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
