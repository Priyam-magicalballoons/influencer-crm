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

interface AddInfluencerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (influencer: Omit<Influencer, "id" | "srNo">) => void;
  onEdit?: (influencer: Influencer) => void;
  editingInfluencer?: Influencer | null;
}

const initialFormState = {
  name: "",
  profileLink: "",
  followers: "",
  typeOfInfluencer: "" as InfluencerType | "",
  email: "",
  contactNumber: "",
  payout: "",
  productAmount: "",
  totalAmount: "",
  orderDate: "",
  receiveDate: "",
  publishedReelDate: "",
  reelLink: "",
  mail: "",
  photo: "",
  review: "",
  views: "",
  likes: "",
  comments: "",
  paymentDate: "",
  gpayNumber: "",
  paymentStatus: "" as PaymentStatus | "",
  paymentDoneDate: "",
  createdBy: "",
  createdAt: "",
  brandName: "",
  approvalRequired: false,
  approved: "",
  approvalComment: "",
};

export function AddInfluencerDialog({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  editingInfluencer,
}: AddInfluencerDialogProps) {
  const [form, setForm] = useState(initialFormState);
  const isEditMode = !!editingInfluencer;

  useEffect(() => {
    if (editingInfluencer) {
      setForm({
        name: editingInfluencer.name,
        profileLink: editingInfluencer.profileLink,
        followers: editingInfluencer.followers.toString(),
        typeOfInfluencer: editingInfluencer.typeOfInfluencer,
        email: editingInfluencer.email,
        contactNumber: editingInfluencer.contactNumber,
        payout: editingInfluencer.payout.toString(),
        productAmount: editingInfluencer.productAmount.toString(),
        totalAmount: editingInfluencer.totalAmount.toString(),
        orderDate: editingInfluencer.orderDate,
        receiveDate: editingInfluencer.receiveDate,
        publishedReelDate: editingInfluencer.publishedReelDate,
        reelLink: editingInfluencer.reelLink,
        mail: editingInfluencer.mail,
        photo: editingInfluencer.photo,
        review: editingInfluencer.review,
        views: editingInfluencer.views.toString(),
        likes: editingInfluencer.likes.toString(),
        comments: editingInfluencer.comments.toString(),
        paymentDate: editingInfluencer.paymentDate,
        gpayNumber: editingInfluencer.gpayNumber,
        paymentStatus: editingInfluencer.paymentStatus,
        paymentDoneDate: editingInfluencer.paymentDoneDate,
        brandName: editingInfluencer.brandName,
        createdAt: editingInfluencer.createdAt,
        createdBy: editingInfluencer.createdBy,
        approvalRequired: editingInfluencer.approvalRequired,
        approvalComment: editingInfluencer.approvalComment || "",
        approved: editingInfluencer.approved || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [editingInfluencer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const influencerData = {
      name: form.name,
      profileLink: form.profileLink,
      followers: parseInt(form.followers) || 0,
      typeOfInfluencer: form.typeOfInfluencer as InfluencerType,
      email: form.email,
      contactNumber: form.contactNumber,
      payout: parseFloat(form.payout) || 0,
      productAmount: parseFloat(form.productAmount) || 0,
      totalAmount: parseFloat(form.totalAmount) || 0,
      orderDate: form.orderDate,
      receiveDate: form.receiveDate,
      publishedReelDate: form.publishedReelDate,
      reelLink: form.reelLink,
      mail: form.mail,
      photo: form.photo,
      review: form.review,
      views: parseInt(form.views) || 0,
      likes: parseInt(form.likes) || 0,
      comments: parseInt(form.comments) || 0,
      paymentDate: form.paymentDate,
      gpayNumber: form.gpayNumber,
      paymentStatus: form.paymentStatus as PaymentStatus,
      paymentDoneDate: form.paymentDoneDate,
      createdBy: form.createdBy,
      createdAt: form.createdAt,
      brandName: form.brandName,
      approvalRequired: form.approvalRequired,
      approved: form.approved,
      approvalComment: form.approvalComment,
    };

    if (isEditMode && onEdit && editingInfluencer) {
      onEdit({
        ...influencerData,
        id: editingInfluencer.id,
        srNo: editingInfluencer.srNo,
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileLink">Profile Link</Label>
                <Input
                  id="profileLink"
                  type="url"
                  value={form.profileLink}
                  onChange={(e) => updateField("profileLink", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers">Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  value={form.followers}
                  onChange={(e) => updateField("followers", e.target.value)}
                  className="bg-secondary/50 border-border"
                  step={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeOfInfluencer">Type of Influencer *</Label>
                <Select
                  value={form.typeOfInfluencer}
                  onValueChange={(value) =>
                    updateField("typeOfInfluencer", value)
                  }
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) => updateField("contactNumber", e.target.value)}
                  className="bg-secondary/50 border-border"
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
                <Label htmlFor="brandName">Name Of Brand</Label>
                <Select
                  value={form.brandName}
                  onValueChange={(value) => updateField("brandName", value)}
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {BrandNames.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                  onChange={(e) => updateField("payout", e.target.value)}
                  className="bg-secondary/50 border-border"
                  step={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productAmount">Product Amount (₹)</Label>
                <Input
                  id="productAmount"
                  type="number"
                  value={form.productAmount}
                  onChange={(e) => updateField("productAmount", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={Number(form.payout) + Number(form.productAmount)}
                  onChange={(e) => updateField("totalAmount", e.target.value)}
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
              <div className="space-y-2">
                <Label htmlFor="approvalRequired">Approval Required ?</Label>
                <Select
                  value={form.approvalRequired ? "YES" : "NO"}
                  onValueChange={(value) =>
                    updateField(
                      "approvalRequired",
                      value === "YES" ? true : false
                    )
                  }
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
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
                <Label htmlFor="approved">Approve</Label>
                <Select
                  value={form.approved}
                  onValueChange={(value) => updateField("approved", value)}
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select Approval" />
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
            </div>
            {form.approved === "OTHER" && (
              <div className="space-y-2">
                <Label htmlFor="approvalComment">Approval Comment</Label>
                <Textarea
                  id="approvalComment"
                  value={form.approvalComment}
                  onChange={(e) =>
                    updateField("approvalComment", e.target.value)
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
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={form.orderDate}
                  onChange={(e) => updateField("orderDate", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiveDate">Receive Date</Label>
                <Input
                  id="receiveDate"
                  type="date"
                  value={form.receiveDate}
                  onChange={(e) => updateField("receiveDate", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedReelDate">Published Reel Date</Label>
                <Input
                  id="publishedReelDate"
                  type="date"
                  value={form.publishedReelDate}
                  onChange={(e) =>
                    updateField("publishedReelDate", e.target.value)
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
                <Label htmlFor="mail">Mail Sent</Label>
                <Select
                  value={form.mail}
                  onValueChange={(value) => updateField("mail", value)}
                  required
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue placeholder="Select Mail" />
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
                <Label htmlFor="reelLink">Reel Link</Label>
                <Input
                  id="reelLink"
                  type="url"
                  value={form.reelLink}
                  onChange={(e) => updateField("reelLink", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo Link</Label>
                <Input
                  id="photo"
                  type="url"
                  value={form.photo}
                  onChange={(e) => updateField("photo", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  type="number"
                  value={form.views}
                  onChange={(e) => updateField("views", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  type="number"
                  value={form.likes}
                  onChange={(e) => updateField("likes", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  type="number"
                  value={form.comments}
                  onChange={(e) => updateField("comments", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                value={form.review}
                onChange={(e) => updateField("review", e.target.value)}
                placeholder="Enter review notes..."
                className="bg-secondary/50 border-border resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => updateField("paymentDate", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpayNumber">GPay Number</Label>
                <Input
                  id="gpayNumber"
                  placeholder="+91 123456789"
                  value={form.gpayNumber}
                  onChange={(e) => updateField("gpayNumber", e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={form.paymentStatus}
                  onValueChange={(value) => updateField("paymentStatus", value)}
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
                <Label htmlFor="paymentDoneDate">Payment Done Date</Label>
                <Input
                  id="paymentDoneDate"
                  type="date"
                  value={form.paymentDoneDate}
                  onChange={(e) =>
                    updateField("paymentDoneDate", e.target.value)
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
            <Button type="submit">
              {isEditMode ? "Save Changes" : "Add Influencer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
