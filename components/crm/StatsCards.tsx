import { Users, DollarSign, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Influencer } from "@/lib/types";

interface StatsCardsProps {
  influencers: Influencer[];
}

export function StatsCards({ influencers }: StatsCardsProps) {
  const totalInfluencers = influencers.length;
  const totalPayout = influencers.reduce((sum, i) => sum + i.payout, 0);
  const totalViews = influencers.reduce((sum, i) => sum + i.views, 0);
  const completedPayments = influencers.filter(
    (i) => i.paymentStatus === "Completed"
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const stats = [
    {
      title: "Total Influencers",
      value: totalInfluencers.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Payout",
      value: formatCurrency(totalPayout),
      icon: DollarSign,
      color: "text-[#14A44D]",
      bgColor: "bg-[#14A44D]/10",
    },
    {
      title: "Total Views",
      value: formatNumber(totalViews),
      icon: Eye,
      color: "text-blue-300",
      bgColor: "bg-blue-300/10",
    },
    {
      title: "Payments Done",
      value: `${completedPayments}/${totalInfluencers}`,
      icon: TrendingUp,
      color: "text-[#E4A11B]",
      bgColor: "bg-[#E4A11B]/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="bg-card border-border animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
