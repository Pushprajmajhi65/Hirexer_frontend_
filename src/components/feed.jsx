import React, { useState, useEffect } from 'react';
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import notifaction from "../images/mainScreen/notifaction.png";
import settting from "../images/mainScreen/settings.png";
import ad from "../images/Commonimg/ad.png";
import options from "../images/Commonimg/options.png";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { MoreProfileOptions } from "./profile";
import navicon from "../images/Commonimg/navicon.png";
import toast from 'react-hot-toast';

// Main FeedUI component
export const FeedUI = () => {
  const [showNavBar, setShowNavBar] = useState(false);
  const [posts, setPosts] = useState([]); // State to hold posts data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const toggleNavBar = () => {
    setShowNavBar((prev) => !prev);
  };

  const toggleCreatePostPopup = () => {
    setIsCreatePostOpen((prev) => !prev);
  };

  // Fetching posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/posts/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data); // Set posts data
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []); // Run effect once on mount

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="flex w-full h-full gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] justify-center xl:justify-start xl:p-0">
      <NavBar />
      {showNavBar ? (
        <div className="fixed z-20 w-full h-full border" onClick={toggleNavBar}>
          <SmallScreenNavBar />
        </div>
      ) : null}
      <div className="flex flex-col w-full xl:w-[1100px] h-full gap-6 px-[40px] pb-[80px] xl:p-0">
        <div className="w-full h-[92px] flex items-center justify-end gap-[10px]">
          <button className="mr-auto xl:hidden" onClick={toggleNavBar}>
            <img src={navicon} className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 p-3">
            <MoreProfileOptions />
            <img src={notifaction} className="w-5 h-5" />
            <img src={settting} className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-row gap-6 max-xl:flex-wrap">
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] font-semibold text-textPrimary">My Feeds</h1>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={toggleCreatePostPopup}
            >
              Create Post
            </button>
            {posts.map((post, index) => (
              <FeedCard key={index} post={post} />
            ))}
          </div>
        </div>
      </div>
      <CreatePostPopup
        isOpen={isCreatePostOpen}
        onClose={toggleCreatePostPopup}
        onPostCreated={addNewPost} 
      />
    </div>
  );
};

// FeedCard component to display individual posts
const FeedCard = ({ post }) => {
  const { post_title, post_description, post_time, image } = post;

  return (
    <div className="w-auto lg:w-[720px] h-auto lg:h-[596px] bg-white rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="w-[56px] h-[56px] border border-black rounded-full"></div>
        <div>
          <h1 className="font-semibold text-[16px] text-textPrimary">{post_title}</h1>
          <p className="text-xs font-normal">Person Name</p>
          <p className="text-xs font-normal text-textSecondary">{new Date(post_time).toLocaleTimeString()}</p>
        </div>
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger>
              <img src={options} className="w-6" />
            </PopoverTrigger>
            <PopoverContent className="flex bg-backgroundGray2">
              <div className="w-full h-[165px] flex flex-col gap-2">
                <div className="absolute flex items-center w-[213px] gap-2">
                  <div className="w-8 h-8 border border-black rounded-full"></div>
                  <div>
                    <h1 className="text-[14px] font-semibold">Person Name</h1>
                    <p className="text-[12px] text-textSecondary">Workspace Name</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                  <Separator className="mt-2" />
                  <button className="border rounded-xl bg-backgroundGreen text-white h-[40px] w-full">
                    Send Connections
                  </button>
                  <button className="border rounded-xl border-borderGreen text-borderGreen h-[40px] w-full">
                    Apply Now
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="text-[16px] w-auto lg:w-[672px]">{post_description}</div>
      {image && <img src={`http://127.0.0.1:8000${image}`} className="w-auto" />}
      <img src={ad} className="w-auto" />
    </div>
  );
};

// CreatePostPopup component to handle creating a post
const CreatePostPopup = ({ isOpen, onClose, onPostCreated }) => {
  const [title, settitle] = useState(""); 
  const [postDescription, setPostDescription] = useState("");
  const [postExperience, setPostExperience] = useState(""); // For the 'experience' field
  const [image, setImage] = useState(null); // For image upload
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const workspaceId = 1; // Static workspace ID

  const handlePost = async () => {
    setError("");
    setSuccess("");
  
    // Validate if the title is empty
    if (!title.trim()) {
      setError("Post title cannot be empty");
      return;
    }
  
    if (!postDescription.trim()) {
      setError("Post description cannot be empty");
      return;
    }
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You are not authorized. Please log in.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("workspace", workspaceId);
      formData.append("title", title);  // Title should be appended here
      formData.append("post_description", postDescription);
      formData.append("experience", postExperience);  // Optional experience field
      
      if (image) {
        formData.append("image", image);  // Append image file if provided
      }
  
      // Sending POST request
      const response = await fetch("http://127.0.0.1:8000/posts/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || "Failed to create post");
      }
  
      const newPost = await response.json();
      settitle(""); // Clear title input after post creation
      setPostDescription(""); // Clear description input
  
      onPostCreated(newPost); // Update the feed with the new post
      onClose();  // Close the popup
      toast.success("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message || "An error occurred while creating the post.");
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[400px]">
        <h2 className="text-lg font-bold mb-2">Create Post</h2>
        {success && <p className="text-green-500 mb-2">{success}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        
        <input
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => settitle(e.target.value)}  
        />
        <textarea
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          placeholder="Post Description"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          type="text"
          placeholder="Experience (optional)"
          value={postExperience}
          onChange={(e) => setPostExperience(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded-md mb-4"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="flex justify-between">
          <button
            className="bg-gray-500 text-white p-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={handlePost}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};