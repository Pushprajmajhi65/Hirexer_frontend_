import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { getInitial } from "@/utils/getInitial";
import { useWorkspace } from "@/context/WorkspaceContext";

const FeedTileDialog = ({ onApply, onEdit, isOwner }) => {
  const { selectedWorkspace } = useWorkspace();

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <section className="flex items-center gap-2 w-full">
        <Avatar className="h-[40px] w-[40px] border-2 border-gray-200">
          <AvatarImage src="" alt="workspace" />
          <AvatarFallback>{getInitial(selectedWorkspace?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-sm capitalize">
            {selectedWorkspace?.name}
          </h3>
          <h4 className="text-muted-foreground text-xs capitalize">
            {selectedWorkspace?.workspace_headmember}
          </h4>
        </div>
      </section>

      {/* Render Edit Post button only for owner */}
      {isOwner ? (
        <Button className="w-full" onClick={onEdit}>
          Edit Post
        </Button>
      ) : (
        // Render Apply Application button for non-owners
        <Button  className="w-full" onClick={onApply}>
          Apply Application
        </Button>
      )}
    </div>
  );
};

export default FeedTileDialog;