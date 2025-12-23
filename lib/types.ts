export type InfluencerType =
  | "Nano (1K-10K)"
  | "Micro (10K-50K)"
  | "Macro (500K-1M)"
  | "Celebrity";

export type PaymentStatus = "Pending" | "Completed";

export type BrandNames = "CIPLA" | "AJANTA" | "SUNPHARMA" | "MANKIND";

export interface Influencer {
  id: string;
  createdBy: string;
  createdAt: string;
  brandName: string;
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
  "Macro (500K-1M)",
  "Celebrity",
];

export const paymentStatuses: PaymentStatus[] = ["Pending", "Completed"];

export const BrandNames: BrandNames[] = [
  "AJANTA",
  "CIPLA",
  "MANKIND",
  "SUNPHARMA",
];
