import { Plus, Search, Users, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  { value: "all", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = [
  { value: "all", label: "All Years" },
  ...Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  })),
];

interface CRMHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  totalInfluencers: number;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  onExport: () => void;
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
}: CRMHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl whitespace-nowrap font-semibold text-foreground">
              Influencer CRM
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              {totalInfluencers} influencer{totalInfluencers !== 1 ? "s" : ""}{" "}
              in database
            </p> */}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-0 md:pt-4 lg:pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 pl-9 bg-secondary/50 border-border"
            />
          </div>

          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-30 bg-secondary/50 border-border text-neutral-400">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-34 md:w-40 bg-secondary/50 border-border text-neutral-400">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4 text-neutral-400" />
            <span className="text-neutral-400 font-normal">Export Excel</span>
          </Button>

          <Button onClick={onAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Add Influencer</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
