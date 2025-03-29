import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  CirclePlus,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useLogout } from "@/services/auth";
import { useGetUserWorkspace } from "@/services/workspace";
import WorkspaceLoader from "./WorkspaceLoader";
import { useWorkspace } from "@/context/WorkspaceContext";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getInitial } from "@/utils/getInitial";

const HeaderDialog = () => {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);

  const { selectedWorkspace, setSelectedWorkspace, setWorkspaces } =
    useWorkspace();

  const logoutMutation = useLogout();
  const { data, isLoading: isWorkspaceLoading } = useGetUserWorkspace();

  const handleLogOut = () => {
    const refreshToken =
      localStorage.getItem("hirexer_refresh_token") ||
      sessionStorage.getItem("hirexer_refresh_token");

    if (refreshToken) {
      logoutMutation.mutate({ refresh: refreshToken });
    } else {
      toast.error("No refresh token found");
    }
  };

  useEffect(() => {
    if (data) {
      setWorkspaces(data);

      if (!selectedWorkspace && data.length > 0) {
        setSelectedWorkspace(data[0]);
      }
    }
  }, [data, setWorkspaces, selectedWorkspace, setSelectedWorkspace]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-2">
      <div className="mb-4">
        <div className="px-2 mb-2 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-500">Workspaces</h3>
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide px-2 py-1 gap-2"
          style={{
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
          }}
        >
          {isWorkspaceLoading ? (
            <WorkspaceLoader />
          ) : (
            data.map((workspace) => (
              <button
                onClick={() => setSelectedWorkspace(workspace)}
                key={workspace.name}
                className={cn(
                  "flex flex-col items-center gap-1 min-w-[72px] p-2 hover:bg-gray-100 rounded-lg transition-colors",
                  selectedWorkspace?.id === workspace.id ? "bg-figmaPrimary" : ""
                )}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src=""
                    alt={workspace.name}
                  />
                  <AvatarFallback>{getInitial(workspace.name)}</AvatarFallback>
                </Avatar>

                <span className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {workspace.name}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <Separator className="my-2" />

      <div className=" p-2">
        <DropdownMenuItem>
          {" "}
          <Button
            variant=""
            className="w-full"
            onClick={() => navigate("/profile")}
          >
            <div className="flex items-center gap-2 mx-auto">
              <User className="h-4 w-4 text-white" />
              My Profile
            </div>
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Button
            variant="outline"
            onClick={() => navigate("/onboarding")}
            className="w-full border-gray-300 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2 mx-auto">
              <CirclePlus className="h-4 w-4 text-primary" />
              Add Workspace
            </div>
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Button
            onClick={handleLogOut}
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          >
            <div className="flex items-center gap-2 mx-auto">
              <LogOut className="h-4 w-4 text-red-500 hover:text-red-600" />
              Logout
            </div>
          </Button>
        </DropdownMenuItem>
      </div>
    </div>
  );
};

export default HeaderDialog;
