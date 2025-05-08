import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { getInitial } from "@/utils/getInitial";
import { useWorkspace } from "@/context/WorkspaceContext";

const FeedTileDialog = ({ onClose, onApply, onEdit, isOwner }) => {
  const { selectedWorkspace } = useWorkspace();
  
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <section className="flex items-center gap-2 w-full">
        <Avatar className="h-[40px] w-[40px] border-2 border-gray-200">
          <AvatarImage src="" alt="@shadcn" />
          <AvatarFallback>{getInitial(selectedWorkspace.name)}</AvatarFallback>
        </Avatar>
        <div className="">
          <h3 className="font-[600] text-[14px] capitalize">
            {selectedWorkspace.name}
          </h3>
          <h4 className="text-muted-foreground text-xs capitalize">
            {selectedWorkspace.workspace_headmember}
          </h4>
        </div>
      </section>
      
      {isOwner ? (
        <>
          <Button className="w-full" onClick={onEdit}>
            Edit Post
          </Button>
          {!isOwner && (
            <Button variant="outline" className="w-full" onClick={onApply}>
              Apply Application
            </Button>
          )}
        </>
      ) : (
        <Button className="w-full" onClick={onApply}>
          Apply Now
        </Button>
      )}
    </div>
  );
};

export default FeedTileDialog;