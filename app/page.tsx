"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { CRMHeader } from "@/components/crm/CRMHeader";
import { StatsCards } from "@/components/crm/StatsCards";
import { InfluencerTable } from "@/components/crm/InfluencerTable";
import { AddInfluencerDialog } from "@/components/crm/AddInfluencerDialog";
import { DeleteConfirmDialog } from "@/components/crm/DeleteConfirmDialog";
import { Influencer } from "@/lib/types";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import { getRole } from "@/lib/helpers";
import {
  createInfluencer,
  deleteInfluencerData,
  getInfluencersByUserId,
  updateInfluencer,
} from "./actions/influencers";
import { getDataFromRedis, setDataIntoRedis } from "@/redis/index";
import { getALlBrands } from "./actions/brand";
import { getAllUsers } from "./actions/creator";
import { format, isValid } from "date-fns";
import AddBrand from "@/components/crm/AddBrand";
import AddCreator from "@/components/crm/AddCreator";

// Sample data for demonstration
// const sampleInfluencers: Influencer[] = [
//   {
//     id: "1",
//     // srNo: 1,
//     createdBy: "DHANASHREE",
//     createdAt: "2025-12-22",
//     brandName: "CIPLA",
//     name: "Priya Sharma",
//     profileLink: "https://instagram.com/priyasharma",
//     followers: 125000,
//     typeOfInfluencer: "Nano (1K-10K)",
//     email: "priya@email.com",
//     contactNumber: "+91 98765 43210",
//     payout: 15000,
//     productAmount: 5000,
//     totalAmount: 20000,
//     orderDate: "2024-01-15",
//     receiveDate: "2024-01-18",
//     publishedReelDate: "2024-01-22",
//     reelLink: "https://instagram.com/reel/123",
//     mail: "Sent",
//     photo: "https://example.com/photo1.jpg",
//     review: "Great content quality, delivered on time",
//     views: 45000,
//     likes: 3200,
//     comments: 156,
//     paymentDate: "2024-01-25",
//     gpayNumber: "9876543210",
//     paymentStatus: "Completed",
//     paymentDoneDate: "2024-01-25",
//     approvalRequired: true,
//     approved: "YES",
//     approvalComment: "New Comment",
//   },
//   {
//     id: "2",
//     // srNo: 2,
//     createdBy: "DHANASHREE",
//     createdAt: "2025-12-22",
//     brandName: "OPPO",
//     name: "Rahul Verma",
//     profileLink: "https://instagram.com/rahulverma",
//     followers: 45000,
//     typeOfInfluencer: "Micro (10K-50K)",
//     email: "rahul@email.com",
//     contactNumber: "+91 87654 32109",
//     payout: 8000,
//     productAmount: 3000,
//     totalAmount: 11000,
//     orderDate: "2024-01-20",
//     receiveDate: "2024-01-23",
//     publishedReelDate: "",
//     reelLink: "",
//     mail: "Pending",
//     photo: "",
//     review: "",
//     views: 0,
//     likes: 0,
//     comments: 0,
//     paymentDate: "",
//     gpayNumber: "8765432109",
//     paymentStatus: "Pending",
//     paymentDoneDate: "",
//     approvalRequired: false,
//   },
//   {
//     id: "3",
//     createdBy: "SANJEET",
//     createdAt: "2025-12-02",
//     brandName: "AJANTA",
//     // srNo: 3,
//     name: "Ananya Patel",
//     profileLink: "https://instagram.com/ananyapatel",
//     followers: 890000,
//     typeOfInfluencer: "Macro (500K-1M)",
//     email: "ananya@email.com",
//     contactNumber: "+91 76543 21098",
//     payout: 50000,
//     productAmount: 15000,
//     totalAmount: 65000,
//     orderDate: "2024-01-10",
//     receiveDate: "2024-01-12",
//     publishedReelDate: "2024-01-16",
//     reelLink: "https://instagram.com/reel/456",
//     mail: "Sent",
//     photo: "https://example.com/photo3.jpg",
//     review: "Excellent reach and engagement",
//     views: 250000,
//     likes: 18000,
//     comments: 890,
//     paymentDate: "2024-01-18",
//     gpayNumber: "7654321098",
//     paymentStatus: "Completed",
//     paymentDoneDate: "2024-01-18",
//     approvalRequired: true,
//   },
// ];

const page = () => {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openCreatorDialog, setOpenCreatorDialog] = useState(false);
  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("0");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(
    null
  );
  const [deleteInfluencer, setDeleteInfluencer] = useState<Influencer | null>(
    null
  );
  const [role, setRole] = useState<"ADMIN" | "CREATOR">("CREATOR");
  const { user } = useUser();

  useEffect(() => {
    const getUserRole = async () => {
      const role = await getRole();
      setRole(role.role);
    };
    getUserRole();
  }, []);

  const filteredInfluencers = useMemo(() => {
    let filtered = influencers;

    // Filter by month (using orderDate)
    if (selectedYear !== "all" || selectedMonth !== "all") {
      filtered = filtered.filter((influencer) => {
        if (!influencer.created_at) return false;
        const [year, month] = format(influencer.created_at, "yyyy-MM-dd").split(
          "-"
        );

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
          (influencer.email && influencer.email!.toLowerCase().includes(query))
        //  || influencer.type.toLowerCase().includes(query)
      );
    }

    if (selectedCreator !== "0") {
      filtered = filtered.filter((influencer) => {
        return influencer.creator_id === selectedCreator;
      });
    }

    if (selectedBrand !== "All Brands") {
      filtered = filtered.filter((influencer) => {
        return influencer.brand_name === selectedBrand;
      });
    }

    return filtered;
  }, [
    influencers,
    searchQuery,
    selectedMonth,
    selectedYear,
    selectedCreator,
    selectedBrand,
  ]);

  const handleExportExcel = useCallback(() => {
    const exportData = filteredInfluencers.map((inf, index) => ({
      "Sr.No.": index + 1,
      createdBy: inf.creator_name,
      createdAt: isValid(inf.created_at)
        ? format(inf.created_at, "do-MMM-yyyy")
        : "",
      Brand: inf.brand_name,
      Name: inf.name,
      "Profile Link": inf.profile_link,
      Followers: inf.followers,
      "Type Of Influencer": inf.type,
      Email: inf.email,
      "Contact Number": inf.contact,
      Payout: inf.payout,
      "Product Amount": inf.product_amount,
      "Total Amount": inf.total_amount,
      "Order Date": isValid(inf.order_date)
        ? format(inf.order_date, "do-MMM-yyyy")
        : "",
      "Receive Date": isValid(inf.receive_date)
        ? format(inf.receive_date, "do-MMM-yyyy")
        : "",
      "Published Reel Date": inf.published_date,
      "Reel Link": inf.reel_link,
      Mail: inf.email,
      Photo: inf.photo,
      Review: inf.review,
      Views: inf.views,
      Likes: inf.likes,
      Comments: inf.comments,
      "Payment Date": isValid(inf.payment_date)
        ? format(inf.payment_date, "do-MMM-yyyy")
        : "",
      "Gpay Number": inf.gpay_number,
      "Payment Status": inf.payment_status,
      "Payment Done Date": isValid(inf.payment_done)
        ? format(inf.payment_done, "do-MMM-yyyy")
        : "",
      "Approval Required": inf.approval_required,
      "Approval Status": inf.approval_status
        ? inf.approval_status === "OTHER"
          ? inf.approval_comment
          : inf.approval_status
        : "-",
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

  const handleAddInfluencer = async (newInfluencer: Omit<Influencer, "id">) => {
    const influencer: Influencer = {
      ...newInfluencer,
      creator_name: user.name,
    };
    const add = await createInfluencer(influencer);

    setInfluencers((prev) => [...prev, add]);
    toast("Influencer Added", {
      description: `${newInfluencer.name} has been added to the CRM.`,
    });
  };

  const handleEditInfluencer = async (updatedInfluencer: Influencer) => {
    let temp: Influencer | undefined;

    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id === updatedInfluencer.id) {
          temp = inf; // store previous value
          return updatedInfluencer; // replace in array
        }
        return inf;
      })
    );

    const update = await updateInfluencer(updatedInfluencer);

    if (update?.status === 500) {
      toast.error("Error in updating influencer");
      setInfluencers((prev) =>
        prev.map((inf) => (inf.id === temp!.id ? temp : inf))
      );
      return;
    }

    setEditingInfluencer(null);

    toast("Influencer Updated", {
      description: `${updatedInfluencer.name} has been updated.`,
    });
  };

  const handleDeleteInfluencer = async () => {
    if (!deleteInfluencer) return;

    setInfluencers((prev) => {
      const filtered = prev.filter((inf) => inf.id !== deleteInfluencer.id);

      return filtered;
    });

    const deleteInf = await deleteInfluencerData(deleteInfluencer.id!);

    if (deleteInf?.status === 500) {
      toast("Error in deleting influencer", {});
      setDeleteInfluencer(null);
      setInfluencers([...influencers]);
    } else {
      toast("Influencer Deleted", {
        description: `${deleteInfluencer.name} has been removed from the CRM.`,
      });
      setDeleteInfluencer(null);
    }
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

  const getInfluencers = async () => {
    const influencers = await getInfluencersByUserId();
    // console.log(influencers.data);
    setInfluencers(influencers.data as any);
  };
  useEffect(() => {
    getInfluencers();
  }, []);

  // const testRedis = async () => {
  //   const brands = await getALlBrands();
  //   const data = await setDataIntoRedis("brands", brands);
  //   console.log(data);
  // };

  // const testGetRedisData = async () => {
  //   const data = await getDataFromRedis("creators");
  //   console.log(data);
  // };

  // useEffect(() => {
  //   testRedis();
  //   testGetRedisData();
  // }, []);

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
        selectedBrand={selectedBrand}
        onSelectedBrandChange={setSelectedBrand}
        openAddBrand={setOpenBrandDialog}
        openAddCreator={setOpenCreatorDialog}
        role={role}
      />

      <StatsCards influencers={influencers} />

      <div className="px-6 pb-6">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <InfluencerTable
            influencers={filteredInfluencers}
            onEdit={openEditDialog}
            onDelete={setDeleteInfluencer}
            role={role}
          />
        </div>
      </div>

      <AddInfluencerDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onAdd={handleAddInfluencer}
        onEdit={handleEditInfluencer}
        editingInfluencer={editingInfluencer}
        role={role}
      />

      <DeleteConfirmDialog
        open={!!deleteInfluencer}
        onOpenChange={(open) => !open && setDeleteInfluencer(null)}
        onConfirm={handleDeleteInfluencer}
        influencerName={deleteInfluencer?.name || ""}
      />

      <AddBrand open={openBrandDialog} onOpenChange={setOpenBrandDialog} />

      <AddCreator
        open={openCreatorDialog}
        onOpenChange={setOpenCreatorDialog}
      />
    </div>
  );
};

export default page;
