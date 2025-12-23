"use client";

import { useState, useMemo, useCallback } from "react";
import { CRMHeader } from "@/components/crm/CRMHeader";
import { StatsCards } from "@/components/crm/StatsCards";
import { InfluencerTable } from "@/components/crm/InfluencerTable";
import { AddInfluencerDialog } from "@/components/crm/AddInfluencerDialog";
import { DeleteConfirmDialog } from "@/components/crm/DeleteConfirmDialog";
import { Influencer } from "@/lib/types";
// import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Sample data for demonstration
const sampleInfluencers: Influencer[] = [
  {
    id: "1",
    srNo: 1,
    createdBy: "DHANASHREE",
    createdAt: "2025-12-22",
    brandName: "CIPLA",
    name: "Priya Sharma",
    profileLink: "https://instagram.com/priyasharma",
    followers: 125000,
    typeOfInfluencer: "Nano (1K-10K)",
    email: "priya@email.com",
    contactNumber: "+91 98765 43210",
    payout: 15000,
    productAmount: 5000,
    totalAmount: 20000,
    orderDate: "2024-01-15",
    receiveDate: "2024-01-18",
    publishedReelDate: "2024-01-22",
    reelLink: "https://instagram.com/reel/123",
    mail: "Sent",
    photo: "https://example.com/photo1.jpg",
    review: "Great content quality, delivered on time",
    views: 45000,
    likes: 3200,
    comments: 156,
    paymentDate: "2024-01-25",
    gpayNumber: "9876543210",
    paymentStatus: "Completed",
    paymentDoneDate: "2024-01-25",
  },
  {
    id: "2",
    srNo: 2,
    createdBy: "DHANASHREE",
    createdAt: "2025-12-22",
    brandName: "OPPO",
    name: "Rahul Verma",
    profileLink: "https://instagram.com/rahulverma",
    followers: 45000,
    typeOfInfluencer: "Micro (10K-50K)",
    email: "rahul@email.com",
    contactNumber: "+91 87654 32109",
    payout: 8000,
    productAmount: 3000,
    totalAmount: 11000,
    orderDate: "2024-01-20",
    receiveDate: "2024-01-23",
    publishedReelDate: "",
    reelLink: "",
    mail: "Pending",
    photo: "",
    review: "",
    views: 0,
    likes: 0,
    comments: 0,
    paymentDate: "",
    gpayNumber: "8765432109",
    paymentStatus: "Pending",
    paymentDoneDate: "",
  },
  {
    id: "3",
    createdBy: "SANJEET",
    createdAt: "2025-12-02",
    brandName: "AJANTA",
    srNo: 3,
    name: "Ananya Patel",
    profileLink: "https://instagram.com/ananyapatel",
    followers: 890000,
    typeOfInfluencer: "Macro (500K-1M)",
    email: "ananya@email.com",
    contactNumber: "+91 76543 21098",
    payout: 50000,
    productAmount: 15000,
    totalAmount: 65000,
    orderDate: "2024-01-10",
    receiveDate: "2024-01-12",
    publishedReelDate: "2024-01-16",
    reelLink: "https://instagram.com/reel/456",
    mail: "Sent",
    photo: "https://example.com/photo3.jpg",
    review: "Excellent reach and engagement",
    views: 250000,
    likes: 18000,
    comments: 890,
    paymentDate: "2024-01-18",
    gpayNumber: "7654321098",
    paymentStatus: "Completed",
    paymentDoneDate: "2024-01-18",
  },
];

const Index = () => {
  const [influencers, setInfluencers] =
    useState<Influencer[]>(sampleInfluencers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("All Creators");
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(
    null
  );
  const [deleteInfluencer, setDeleteInfluencer] = useState<Influencer | null>(
    null
  );
  // const { toast } = useToast();

  const filteredInfluencers = useMemo(() => {
    let filtered = influencers;

    // Filter by month (using orderDate)
    if (selectedYear !== "all" || selectedMonth !== "all") {
      filtered = filtered.filter((influencer) => {
        if (!influencer.orderDate) return false;
        const [year, month] = influencer.orderDate.split("-");
        const yearMatch = selectedYear === "all" || year === selectedYear;
        const monthMatch = selectedMonth === "all" || month === selectedMonth;
        return yearMatch && monthMatch;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (influencer) =>
          influencer.name.toLowerCase().includes(query) ||
          influencer.email.toLowerCase().includes(query) ||
          influencer.typeOfInfluencer.toLowerCase().includes(query)
      );
    }

    if (selectedCreator !== "All Creators") {
      filtered = filtered.filter((influencer) => {
        return influencer.createdBy === selectedCreator;
      });
    }

    return filtered;
  }, [influencers, searchQuery, selectedMonth, selectedYear, selectedCreator]);

  const handleExportExcel = useCallback(() => {
    const exportData = filteredInfluencers.map((inf) => ({
      "Sr.No.": inf.srNo,
      Name: inf.name,
      "Profile Link": inf.profileLink,
      Followers: inf.followers,
      "Type Of Influencer": inf.typeOfInfluencer,
      Email: inf.email,
      "Contact Number": inf.contactNumber,
      Payout: inf.payout,
      "Product Amount": inf.productAmount,
      "Total Amount": inf.totalAmount,
      "Order Date": inf.orderDate,
      "Receive Date": inf.receiveDate,
      "Published Reel Date": inf.publishedReelDate,
      "Reel Link": inf.reelLink,
      Mail: inf.mail,
      Photo: inf.photo,
      Review: inf.review,
      Views: inf.views,
      Likes: inf.likes,
      Comments: inf.comments,
      "Payment Date": inf.paymentDate,
      "Gpay Number": inf.gpayNumber,
      "Payment Status": inf.paymentStatus,
      "Payment Done Date": inf.paymentDoneDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Influencers");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `influencers_${date}.xlsx`);

    toast("Export Successful", {
      description: `Exported ${filteredInfluencers.length} influencer(s) to Excel.`,
    });
  }, [filteredInfluencers, toast]);

  const handleAddInfluencer = (
    newInfluencer: Omit<Influencer, "id" | "srNo">
  ) => {
    const influencer: Influencer = {
      ...newInfluencer,
      id: Date.now().toString(),
      srNo: influencers.length + 1,
    };

    setInfluencers((prev) => [...prev, influencer]);
    toast("Influencer Added", {
      description: `${newInfluencer.name} has been added to the CRM.`,
    });
  };

  const handleEditInfluencer = (updatedInfluencer: Influencer) => {
    setInfluencers((prev) =>
      prev.map((inf) =>
        inf.id === updatedInfluencer.id ? updatedInfluencer : inf
      )
    );
    setEditingInfluencer(null);
    toast("Influencer Updated", {
      description: `${updatedInfluencer.name} has been updated.`,
    });
  };

  const handleDeleteInfluencer = () => {
    if (!deleteInfluencer) return;

    setInfluencers((prev) => {
      const filtered = prev.filter((inf) => inf.id !== deleteInfluencer.id);
      // Renumber srNo
      return filtered.map((inf, index) => ({ ...inf, srNo: index + 1 }));
    });

    toast("Influencer Deleted", {
      description: `${deleteInfluencer.name} has been removed from the CRM.`,
    });
    setDeleteInfluencer(null);
  };

  const openEditDialog = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingInfluencer(null);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <CRMHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsDialogOpen(true)}
        totalInfluencers={influencers.length}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onExport={handleExportExcel}
        onCreatorChange={setSelectedCreator}
        selectedCreator={selectedCreator}
      />

      <StatsCards influencers={influencers} />

      <div className="px-6 pb-6">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <InfluencerTable
            influencers={filteredInfluencers}
            onEdit={openEditDialog}
            onDelete={setDeleteInfluencer}
          />
        </div>
      </div>

      <AddInfluencerDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onAdd={handleAddInfluencer}
        onEdit={handleEditInfluencer}
        editingInfluencer={editingInfluencer}
      />

      <DeleteConfirmDialog
        open={!!deleteInfluencer}
        onOpenChange={(open) => !open && setDeleteInfluencer(null)}
        onConfirm={handleDeleteInfluencer}
        influencerName={deleteInfluencer?.name || ""}
      />
    </div>
  );
};

export default Index;
