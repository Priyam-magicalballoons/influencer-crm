import { ExternalLink, Pencil, Trash2 } from "lucide-react";
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

interface InfluencerTableProps {
  influencers: Influencer[];
  onEdit: (influencer: Influencer) => void;
  onDelete: (influencer: Influencer) => void;
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
}: InfluencerTableProps) {
  if (influencers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <p>No influencers found. Add your first influencer to get started.</p>
      </div>
    );
  }

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
            <TableHead className="min-w-25 text-muted-foreground font-medium">
              Followers
            </TableHead>
            <TableHead className="min-w-35 text-muted-foreground font-medium">
              Type
            </TableHead>
            <TableHead className="min-w-45 text-muted-foreground font-medium">
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
            <TableHead className="min-w-25 text-muted-foreground font-medium">
              Total Amt
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
            <TableHead className="min-w-25 text-muted-foreground font-medium">
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
            <TableHead className="min-w-20 md:min-w-25 text-muted-foreground font-medium sticky right-0 bg-card">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.map((influencer, index) => (
            <TableRow
              key={influencer.id}
              className={`hover:bg-muted/50 transition-colors  
                
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell
                className={`border-border hover:bg-muted/50 transition-colors sticky left-0 ${
                  influencer.reelLink && "bg-orange-500 hover:bg-orange-500/80"
                } ${
                  influencer.paymentStatus === "Completed" &&
                  "bg-green-500 hover:bg-green-500/80"
                }`}
              >
                {/* {influencer.srNo} */}
              </TableCell>
              <TableCell className="font-medium text-foreground text-center">
                {influencer.srNo}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.createdBy}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.createdAt}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.brandName}
              </TableCell>
              <TableCell className="font-medium text-foreground ">
                {influencer.name}
              </TableCell>
              <TableCell>
                {influencer.profileLink && (
                  <a
                    href={influencer.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell className="text-foreground">
                {formatNumber(influencer.followers)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/10"
                >
                  {influencer.typeOfInfluencer}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.contactNumber}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {formatCurrency(influencer.payout)}
              </TableCell>
              <TableCell className="text-foreground">
                {formatCurrency(influencer.productAmount)}
              </TableCell>
              <TableCell className="text-foreground font-semibold">
                {formatCurrency(influencer.totalAmount)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.orderDate}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.receiveDate}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.publishedReelDate}
              </TableCell>
              <TableCell>
                {influencer.reelLink && (
                  <a
                    href={influencer.reelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.mail}
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
              <TableCell className="text-foreground">
                {formatNumber(influencer.views)}
              </TableCell>
              <TableCell className="text-foreground">
                {formatNumber(influencer.likes)}
              </TableCell>
              <TableCell className="text-foreground">
                {formatNumber(influencer.comments)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.paymentDate}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.gpayNumber}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getPaymentStatusVariant(influencer.paymentStatus)}
                >
                  {influencer.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {influencer.paymentDoneDate}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(influencer)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
