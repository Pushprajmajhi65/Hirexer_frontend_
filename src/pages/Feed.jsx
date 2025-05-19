import React, { useState } from "react";
import FeedTile from "@/components/Feeds/FeedTile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePost from "@/components/Feeds/CreatePost";
import { useGetPosts } from "@/services/post";
import FeedTileSkeleton from "@/components/Feeds/FeedTileSkeleton";

import { AlertCircle } from "lucide-react";
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
        <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl bg-gray-50">
          <div className="mb-4 p-4 bg-gray-100 rounded-full">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Posts Yet
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            It looks like there are no posts available at the moment. Once posts are created, they’ll appear here.
          </p>
        </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
