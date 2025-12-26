import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setEmail(localStorage.getItem("userEmail") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Get initial for avatar
  const displayInitial = email ? email.substring(0, 1).toUpperCase() : "U";
  const displayName = email || "Demo Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-sm font-medium text-white">
          {displayInitial}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-[12px] shadow-lg">
        <div className="px-3 py-3 text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate px-2">{displayName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Exploring OASIS</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}