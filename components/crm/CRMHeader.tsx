"use client";

import {
  Plus,
  Search,
  Users,
  Download,
  Calendar,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getDataFromRedis } from "@/redis";
import { logoutUser } from "@/lib/helpers";
import OptionsSheet from "./OptionsSheet";

interface CRMHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  totalInfluencers: number;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  selectedCreator: string;
  onCreatorChange: (value: string) => void;
  onExport: () => void;
  selectedBrand: string;
  onSelectedBrandChange: (value: string) => void;
  openAddBrand: (value: boolean) => void;
  openAddCreator: (value: boolean) => void;
  role: "ADMIN" | "CREATOR";
}

export function CRMHeader({
  searchQuery,
  onSearchChange,
  onAddClick,
  totalInfluencers,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  onExport,
  onCreatorChange,
  selectedCreator,
  onSelectedBrandChange,
  selectedBrand,
  openAddBrand,
  openAddCreator,
  role,
}: CRMHeaderProps) {
  const [creators, setCreators] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [openSheet, setOpenSheet] = useState(false);

  const getCreators = async () => {
    const data = await getDataFromRedis("creators");
    setCreators([{ id: "0", name: "All Creators" }, ...(data as any)]);
  };

  const getBrands = async () => {
    const data = await getDataFromRedis("brand");
    setBrands([{ id: "0", name: "All Brands" }, ...(data as any)]);
  };
  useEffect(() => {
    getCreators();
    getBrands();
  }, []);

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex md:flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mr-0 md:mr-9">
        <div className="flex items-center gap-3 mt-0 md:mt-3 lg:mt-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl whitespace-nowrap font-semibold text-foreground">
              Influencer CRM
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-0 md:pt-4 lg:pt-0 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:w-40 lg:w-full pl-9 bg-secondary/50 border-border text-white"
            />
          </div>
          <div className="gap-2 hidden md:flex">
            <Select value={selectedCreator} onValueChange={onCreatorChange}>
              <SelectTrigger className="w-28 lg:w-full bg-secondary/50 border-border text-neutral-400">
                <SelectValue placeholder="Creator" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBrand} onValueChange={onSelectedBrandChange}>
              <SelectTrigger className="w-28 lg:w-full bg-secondary/50 border-border text-neutral-400">
                <SelectValue placeholder="Select    Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.name} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onAddClick}
            className="gap-2 right-6 min-[765px]:static max-[613]:absolute cursor-pointer
            "
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Add</span>
            <span className="hidden lg:inline">Influencer</span>
          </Button>
        </div>
      </div>
      <div className="mt-2 md:mt-4 flex h-8 justify-start items-start absolute right-6 md:right-5 lg:top-1">
        <OptionsSheet
          onOpenChange={setOpenSheet}
          open={openSheet}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          role={role}
          onCreatorChange={onCreatorChange}
          onExport={onExport}
          onSelectedBrandChange={onSelectedBrandChange}
          openAddBrand={openAddBrand}
          openAddCreator={openAddCreator}
          selectedBrand={selectedBrand}
          selectedCreator={selectedCreator}
        />
      </div>
    </header>
  );
}
