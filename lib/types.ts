export type InfluencerType =
  | "Nano (1K-10K)"
  | "Micro (10K-50K)"
  | "Macro (500K-1M)"
  | "Celebrity (1M+)";

export type PaymentStatus = "Pending" | "Completed";

export type BrandNames =
  | "CIPLA"
  | "AJANTA"
  | "SUNPHARMA"
  | "MANKIND"
  | "ALL Brands";

export interface Influencer {
  id?: string;
  creator_id: string;
  creator_name?: string;
  created_at: string;
  brand_name: string;
  // srNo: number;
  name: string;
  profile: string;
  followers: string;
  type: InfluencerType;
  email?: string;
  contact?: string;
  payout?: number;
  product_amount?: number;
  total_amount?: number;
  order_date?: string | null;
  receive_date?: string | null;
  published_date?: string | null;
  reel_link?: string;
  mail_status?: string;
  photo?: string;
  review?: string;
  views?: string;
  likes?: string;
  comments?: string;
  payment_date?: string | null;
  gpay_number?: string;
  payment_status?: PaymentStatus;
  payment_done?: string | null;
  approval_required?: string;
  ask_price?: number | null;
  approval_status?: string;
  approval_comment?: string;
}

export const influencerTypes: InfluencerType[] = [
  "Nano (1K-10K)",
  "Micro (10K-50K)",
  "Macro (500K-1M)",
  "Celebrity (1M+)",
];

export const paymentStatuses: PaymentStatus[] = ["Pending", "Completed"];

export const BrandNames: BrandNames[] = [
  "AJANTA",
  "CIPLA",
  "MANKIND",
  "SUNPHARMA",
  "ALL Brands",
];
