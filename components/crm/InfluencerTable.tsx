"use client";

import {
  ArrowDownUpIcon,
  ExternalLink,
  FilterIcon,
  Pencil,
  SortAscIcon,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Influencer, PaymentStatus } from "@/lib/types";
import { format, isValid } from "date-fns";

interface InfluencerTableProps {
  influencers: Influencer[];
  onEdit: (influencer: Influencer) => void;
  onDelete: (influencer: Influencer) => void;
  role: "ADMIN" | "CREATOR";
  sortTotalAmount: string;
  setSortTotalAmount: (value: string) => void;
  sortFollowers: string;
  setSortFollowers: (value: string) => void;
  sortApproval: string;
  setSortApproval: (value: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPaymentStatusVariant(status: PaymentStatus) {
  switch (status) {
    case "Completed":
      return "default";
    default:
      return "secondary";
  }
}

export function InfluencerTable({
  influencers,
  onEdit,
  onDelete,
  role,
  sortTotalAmount,
  setSortTotalAmount,
  sortFollowers,
  setSortFollowers,
  sortApproval,
  setSortApproval,
}: InfluencerTableProps) {
  if (influencers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <p>No influencers found. Add your first influencer to get started.</p>
      </div>
    );
  }

  // console.log(influencers);

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="w-16 text-muted-foreground font-medium">
              {/* Sr.No. */}
            </TableHead>
            <TableHead className="w-16 text-muted-foreground font-medium">
              Sr.No.
            </TableHead>
            <TableHead className="min-w-35 text-muted-foreground font-medium">
              CreatedBy
            </TableHead>
            <TableHead className="min-w-35 text-muted-foreground font-medium">
              CreatedAt
            </TableHead>
            <TableHead className="min-w-35 text-muted-foreground font-medium">
              Brand
            </TableHead>
            <TableHead className="min-w-35 text-muted-foreground font-medium">
              Name
            </TableHead>
            <TableHead className="min-w-25 text-muted-foreground font-medium">
              Profile
            </TableHead>
            <TableHead
              className="min-w-25 text-muted-foreground font-medium flex items-center gap-1 px-3 cursor-pointer"
              onClick={() => {
                setSortApproval("");
                setSortTotalAmount("");
                sortFollowers === "desc"
                  ? setSortFollowers("asc")
                  : setSortFollowers("desc");
              }}
            >
              <p>Followers</p>
              <ArrowDownUpIcon className="size-3" />
            </TableHead>
            <TableHead className="min-w-35 text-muted-foreground font-medium text-center">
              Type
            </TableHead>
            <TableHead className="min-w-45 text-muted-foreground font-medium text-center">
              Email
            </TableHead>
            <TableHead className="min-w-32.5 text-muted-foreground font-medium">
              Contact
            </TableHead>
            <TableHead className="min-w-25 text-muted-foreground font-medium">
              Payout
            </TableHead>
            <TableHead className="min-w-25 text-muted-foreground font-medium">
              Product Amt
            </TableHead>
            <TableHead
              className="min-w-25 text-muted-foreground font-medium flex items-center gap-1 px-3 cursor-pointer"
              onClick={() => {
                setSortApproval("");
                setSortFollowers("");
                sortTotalAmount === "desc"
                  ? setSortTotalAmount("asc")
                  : setSortTotalAmount("desc");
              }}
            >
              <p>Total Amt</p>
              <ArrowDownUpIcon className="size-3" />
            </TableHead>
            <TableHead className="min-w-27.5 text-muted-foreground font-medium">
              Order Date
            </TableHead>
            <TableHead className="min-w-27.5 text-muted-foreground font-medium">
              Receive Date
            </TableHead>
            <TableHead className="min-w-30 text-muted-foreground font-medium">
              Published Date
            </TableHead>
            <TableHead className="min-w-25 text-muted-foreground font-medium">
              Reel Link
            </TableHead>
            <TableHead className="min-w-25 text-muted-foreground font-medium text-center">
              Mail
            </TableHead>
            <TableHead className="min-w-20 text-muted-foreground font-medium">
              Photo
            </TableHead>
            <TableHead className="min-w-37.5 text-muted-foreground font-medium">
              Review
            </TableHead>
            <TableHead className="min-w-20 text-muted-foreground font-medium">
              Views
            </TableHead>
            <TableHead className="min-w-20 text-muted-foreground font-medium">
              Likes
            </TableHead>
            <TableHead className="min-w-20 text-muted-foreground font-medium">
              Comments
            </TableHead>
            <TableHead className="min-w-27.5 text-muted-foreground font-medium">
              Payment Date
            </TableHead>
            <TableHead className="min-w-32.5 text-muted-foreground font-medium">
              GPay Number
            </TableHead>
            <TableHead className="min-w-30 text-muted-foreground font-medium">
              Payment Status
            </TableHead>
            <TableHead className="min-w-30 text-muted-foreground font-medium">
              Payment Done
            </TableHead>
            <TableHead
              className="min-w-25 text-muted-foreground font-medium flex items-center gap-1 px-3 cursor-pointer"
              onClick={() => {
                setSortFollowers("");
                setSortTotalAmount("");
                sortApproval === "no"
                  ? setSortApproval("yes")
                  : setSortApproval("no");
              }}
            >
              <p>Approval Required</p>
              <ArrowDownUpIcon className="size-3" />
            </TableHead>
            <TableHead className="min-w-30 text-muted-foreground font-medium text-center">
              Ask Price
            </TableHead>
            <TableHead className="min-w-30 text-muted-foreground font-medium text-center">
              Approval Status
            </TableHead>
            <TableHead className="min-w-20 md:min-w-25 text-muted-foreground font-medium sticky right-0 bg-card">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.map((influencer, index) => (
            <TableRow
              key={influencer.id}
              className={`hover:bg-muted/50 transition-colors ${
                influencer.approval_required === "YES" &&
                !influencer.approval_status &&
                !influencer.approval_comment &&
                "bg-red-900 hover:bg-red-900/80"
              }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <TableCell
                className={`border-border hover:bg-muted/50 transition-colors sticky left-0
                  ${influencer.order_date && "bg-blue-400 hover:bg-blue-500/80"}
                  ${
                    influencer.reel_link &&
                    "bg-orange-500 hover:bg-orange-500/80"
                  } ${
                  influencer.payment_status === "Completed" &&
                  "bg-green-500 hover:bg-green-500/80"
                }`}
              ></TableCell>
              <TableCell className="font-medium text-foreground text-center">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.creator_name}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {isValid(influencer.created_at)
                  ? format(influencer.created_at, "do-MMM-yyyy")
                  : ""}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.brand_name}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.name}
              </TableCell>
              <TableCell>
                {influencer.profile && (
                  <a
                    href={influencer.profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    View <ExternalLink className="h-3 w-3" />
                    <p className="text-[0px]">{influencer.profile}</p>
                  </a>
                )}
              </TableCell>
              <TableCell className="text-foreground text-center">
                {influencer.followers}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/10"
                >
                  {influencer.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.contact}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {formatCurrency(Number(influencer.payout))}
              </TableCell>
              <TableCell className="text-foreground">
                {formatCurrency(Number(influencer.product_amount))}
              </TableCell>
              <TableCell className="text-foreground font-semibold text-center">
                {formatCurrency(Number(influencer.total_amount))}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isValid(influencer.order_date)
                  ? format(influencer.order_date!, "dd-MM-yy")
                  : ""}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isValid(influencer.receive_date)
                  ? format(influencer.receive_date!, "dd-MM-yy")
                  : ""}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isValid(influencer.published_date)
                  ? format(influencer.published_date!, "dd-MM-yy")
                  : ""}
              </TableCell>
              <TableCell>
                {influencer.reel_link && (
                  <a
                    href={influencer.reel_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.email}
              </TableCell>
              <TableCell>
                {influencer.photo && (
                  <a
                    href={influencer.photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-37.5 truncate">
                {influencer.review}
              </TableCell>
              <TableCell className="text-foreground text-center">
                {influencer.views}
              </TableCell>
              <TableCell className="text-foreground text-center">
                {influencer.likes}
              </TableCell>
              <TableCell className="text-foreground text-center">
                {influencer.comments}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isValid(influencer.payment_date)
                  ? format(influencer.payment_date!, "dd-MM-yy")
                  : ""}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.gpay_number}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getPaymentStatusVariant(
                    influencer.payment_status || "Pending"
                  )}
                >
                  {influencer.payment_status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isValid(influencer.payment_done)
                  ? format(influencer.payment_done!, "dd-MM-yy")
                  : ""}
              </TableCell>
              <TableCell className="text-muted-foreground text-center">
                {influencer.approval_required === "YES" ? "YES" : "NO"}
              </TableCell>
              <TableCell className="text-muted-foreground text-center">
                {influencer.ask_price}
              </TableCell>
              <TableCell className="text-muted-foreground text-center min-w-64 whitespace-pre-wrap line-clamp-3">
                {influencer.approval_status
                  ? influencer.approval_status === "OTHER"
                    ? influencer.approval_comment
                    : influencer.approval_status
                  : "-"}
              </TableCell>
              <TableCell className="sticky right-0 bg-card">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit(influencer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {role === "ADMIN" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(influencer)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
