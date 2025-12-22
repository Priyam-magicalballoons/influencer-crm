export type InfluencerType =
  | "Nano (1K-10K)"
  | "Micro (10K-50K)"
  //   | "Mid-tier (50K-500K)"
  | "Macro (500K-1M)";
//   | "Mega (1M+)";

export type PaymentStatus = "Pending" | "Processing" | "Completed" | "Failed";

export interface Influencer {
  id: string;
  srNo: number;
  name: string;
  profileLink: string;
  followers: number;
  typeOfInfluencer: InfluencerType;
  email: string;
  contactNumber: string;
  payout: number;
  productAmount: number;
  totalAmount: number;
  orderDate: string;
  receiveDate: string;
  publishedReelDate: string;
  reelLink: string;
  mail: string;
  photo: string;
  review: string;
  views: number;
  likes: number;
  comments: number;
  paymentDate: string;
  gpayNumber: string;
  paymentStatus: PaymentStatus;
  paymentDoneDate: string;
}

export const influencerTypes: InfluencerType[] = [
  "Nano (1K-10K)",
  "Micro (10K-50K)",
  //   "Mid-tier (50K-500K)",
  "Macro (500K-1M)",
  //   "Mega (1M+)",
];

export const paymentStatuses: PaymentStatus[] = [
  "Pending",
  "Processing",
  "Completed",
  "Failed",
];
