import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Calendar,
  Calendar1Icon,
  Download,
  LogOutIcon,
  MenuIcon,
  MoreVerticalIcon,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { logoutUser } from "@/lib/helpers";

interface OptionsSheetProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  role: "ADMIN" | "CREATOR";
  selectedCreator: string;
  onCreatorChange: (value: string) => void;
  onExport: () => void;
  selectedBrand: string;
  onSelectedBrandChange: (value: string) => void;
  openAddBrand: (value: boolean) => void;
  openAddCreator: (value: boolean) => void;
}

const OptionsSheet = ({
  onOpenChange,
  open,
  onMonthChange,
  onYearChange,
  selectedMonth,
  selectedYear,
  role,
  onCreatorChange,
  onExport,
  onSelectedBrandChange,
  openAddBrand,
  openAddCreator,
  selectedBrand,
  selectedCreator,
}: OptionsSheetProps) => {
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
  const handleLogout = async () => {
    localStorage.removeItem("user");
    await logoutUser();
  };
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger>
        <MenuIcon color="white" className="size-8 cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="bg-sidebar-accent-foreground border-0 w-64">
        <SheetHeader>
          <SheetTitle className="text-white">Filter Options</SheetTitle>
          <SheetDescription>Select Filters</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4">
          {role === "ADMIN" && (
            <>
              <Button onClick={() => openAddBrand(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="">Add Brand</span>
              </Button>
              <Button onClick={() => openAddCreator(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="">Add Creator</span>
              </Button>
            </>
          )}

          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-full border-border/50 text-neutral-400">
              <Calendar1Icon className="h-4 w-4 mr-2" />
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
            <SelectTrigger className="border-accent/50 text-neutral-400 w-full">
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
          <Button
            variant="outline"
            onClick={onExport}
            className="gap-2 bg-[#236f4b]"
          >
            <Download className="h-4 w-4 text-neutral-100 font-bold" />
            <span className="text-neutral-100 font-semibold">Export Excel</span>
          </Button>
        </div>
        <SheetFooter>
          <Button
            onClick={handleLogout}
            className="gap-2"
            variant={"destructive"}
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OptionsSheet;
