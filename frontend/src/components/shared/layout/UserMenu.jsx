import React, { useState } from "react";
import { ChevronDown, User, LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-[10px] hover:bg-[#F6F7FB] transition-colors">
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-sm font-medium text-white">
          U
        </div>
        <ChevronDown className="w-4 h-4 text-[#64748B]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-[#E2E8F0] rounded-[12px] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-[#0F172A]">User Account</p>
          <p className="text-xs text-[#64748B]">user@example.com</p>
        </div>
        <DropdownMenuSeparator className="bg-[#E2E8F0]" />
        <DropdownMenuItem className="text-[#0F172A] hover:bg-[#F6F7FB] rounded-[10px]">
          <User className="w-4 h-4 mr-2 text-[#64748B]" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#0F172A] hover:bg-[#F6F7FB] rounded-[10px]">
          <HelpCircle className="w-4 h-4 mr-2 text-[#64748B]" />
          Help & Support
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#E2E8F0]" />
        <DropdownMenuItem className="text-[#0F172A] hover:bg-[#F6F7FB] rounded-[10px]">
          <LogOut className="w-4 h-4 mr-2 text-[#64748B]" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}