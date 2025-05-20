import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { EllipsisVertical } from "lucide-react";
import FeedTileDialog from "./FeedTileDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { getInitial } from "@/utils/getInitial";
import ApplyDialog from "./ApplyDialog";
import EditPost from "./EditPost";
import { Dialog } from "../ui/dialog";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";

const FeedTile = ({ el }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { selectedWorkspace } = useWorkspace();
  const { user } = useAuth(); 

  // Get username from localStorage with safety check
  const localUsername = typeof window !== "undefined" ? localStorage.getItem("hirexer_username") : null;
  const isOwner = el.user === localUsername;

  const handleDropdownClose = () => setDropdownOpen(false);
  const handleApplyClick = () => {
    setDropdownOpen(false);
    setApplyDialogOpen(true);
  };
  const handleEditClick = () => {
    setDropdownOpen(false);
    setEditDialogOpen(true);
  };

  // Safety check for el and its properties
  if (!el || !el.workspace) {
    return null; // or return a placeholder/skeleton
  }

  return (
    <div>
      <Card>
        <CardContent>
          <section className="flex items-center justify-between">
            <section className="flex gap-2 items-center">
              <Avatar className="h-[56px] w-[56px] border-2 border-gray-200">
                <AvatarImage src="" alt={el.user} />
                <AvatarFallback>{getInitial(el.user)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-[600] text-[16px] capitalize">
                  {el.workspace.name}
                </h3>
                <span className="font-[400] text-[14px] capitalize">
                  {el.user}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(el.post_time))}
                </span>
              </div>
            </section>

            {selectedWorkspace?.id === el.workspace.id && (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    type="button" 
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Post options"
                  >
                    <EllipsisVertical />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-3 w-[210px]">
                  <FeedTileDialog
                    onClose={handleDropdownClose}
                    onApply={handleApplyClick}
                    onEdit={handleEditClick}
                    isOwner={isOwner}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </section>

          <h2 className="pt-2 pb-1 font-[700] text-primary/90">{el.title}</h2>
          <p className="pb-2 text-primary/70 font-[400] text-[16px] break-words break-all">
            {el.post_description}
          </p>

          {el.image && (
            <img
              src={el.image}
              alt="post image"
              className="w-full aspect-[16/9] object-cover rounded-md"
            />
          )}
        </CardContent>
      </Card>

      {/* Apply dialog with null checks */}
      {applyDialogOpen && (
        <ApplyDialog
          id={el.id}
          open={applyDialogOpen}
          onClose={() => setApplyDialogOpen(false)}
          userEmail={user?.email || ''} 
        />
      )}

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditPost post={el} onClose={() => setEditDialogOpen(false)} />
      </Dialog>
    </div>
  );
};

export default FeedTile;