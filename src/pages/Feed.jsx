import React, { useState } from "react";
import FeedTile from "@/components/Feeds/FeedTile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePost from "@/components/Feeds/CreatePost";
import { useGetPosts } from "@/services/post";
import FeedTileSkeleton from "@/components/Feeds/FeedTileSkeleton";

const Feed = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const { data, isLoading } = useGetPosts();

  const sortedPosts = data?.slice()?.sort((a, b) => {
    return new Date(b.post_time) - new Date(a.post_time);
  });

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h1 className="font-[700] text-[36px] text-primary/90 ">My feeds</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button>Create post</Button>
          </DialogTrigger>
          <DialogContent className="w-[500px]">
            <CreatePost onClose={handleCloseDialog} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <FeedTileSkeleton key={index} />
          ))
        ) : sortedPosts && sortedPosts.length > 0 ? (
          sortedPosts.map((el) => <FeedTile key={el.id} el={el} />)
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
