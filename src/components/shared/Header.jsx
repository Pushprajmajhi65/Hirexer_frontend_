import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import HeaderDialog from "../header/HeaderDialog";
import { useWorkspace } from "@/context/WorkspaceContext";
import { getInitial } from "@/utils/getInitial";

const Header = () => {
  const location = useLocation();
  const { userName, showTransferDialog, setShowTransferDialog } = useWorkspace();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const selectedWorkspace = localStorage.getItem('selectedWorkspace');
    if (!selectedWorkspace) {
      setIsDropdownOpen(true);
    }
  }, []);

  // Keep dropdown open if transfer dialog is open
  useEffect(() => {
    if (showTransferDialog) {
      setIsDropdownOpen(true);
    }
  }, [showTransferDialog]);

  const backgroundClass =
    location.pathname === "/applications" || "/applied jobs"
      ? "bg-applicationBg"
      : "bg-figmaGray";

  return (
    <div
      className={cn(
        "h-[90px] flex items-center justify-end py-6 px-4 xl:px-16 sticky top-0 z-20 shadow-sm",
        backgroundClass
      )}
    >
      <div className="flex items-center gap-6">
        <DropdownMenu 
          open={isDropdownOpen} 
          onOpenChange={(open) => {
            // Don't allow closing if transfer dialog is open
            if (!showTransferDialog) {
              setIsDropdownOpen(open);
            }
          }}
        >
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Avatar className="h-10 w-10 border-2 border-gray-200">
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback>{getInitial(userName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {userName}
                </h3>
                <span className="text-xs text-gray-500">Super Admin</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[320px] p-2 mt-2">
            <HeaderDialog 
              isOpen={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
              showTransferDialog={showTransferDialog}
              setShowTransferDialog={setShowTransferDialog}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;