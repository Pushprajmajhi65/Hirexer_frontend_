import React, { useState, useEffect } from "react";
import { NavBar, SmallScreenNavBar } from "./UserOverview";
import notifaction from "../images/mainScreen/notifaction.png";
import settting from "../images/mainScreen/settings.png";
import ad from "../images/Commonimg/ad.png";
import options from "../images/Commonimg/options.png";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { MoreProfileOptions } from "./profile";
import navicon from "../images/Commonimg/navicon.png";
import toast from "react-hot-toast";
import api from "@/api";
import { useWorkspace } from "./WorkspaceContext";



export const FeedUI = () => {
  const [showNavBar, setShowNavBar] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { selectedWorkspace } = useWorkspace(); // Use selected workspace from context

  const toggleNavBar = () => {
    setShowNavBar((prev) => !prev);
  };

  const toggleCreatePostPopup = () => {
    setIsCreatePostOpen((prev) => !prev);
  };

  // Fetch posts for the selected workspace
  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedWorkspace) return; // Don't fetch if no workspace is selected

      try {
        const response = await api.get(`/posts/?workspace=${selectedWorkspace.id}`);
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        toast.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedWorkspace]); // Re-fetch when workspace changes

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

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
            <img src={navicon} className="w-6 h-6" alt="Menu" />
          </button>
          <div className="flex items-center gap-2 p-3">
            <MoreProfileOptions />
           
          </div>
        </div>
        <div className="flex flex-row gap-6 max-xl:flex-wrap">
          <div className="flex flex-col gap-6">
            <h1 className="text-[32px] font-semibold text-textPrimary">My Feeds</h1>
            <button
              className="bg-blue-500 text-white w-[140px] h-[48px] p-2 rounded-md ml-auto"
              onClick={toggleCreatePostPopup}
            >
              Create Post
            </button>
            {loading ? (
              [...Array(4)].map((_, index) => <FeedCardSkeleton key={index} />)
            ) : (
              posts.map((post, index) => <FeedCard key={index} post={post} />)
            )}
          </div>
        </div>
      </div>
      <CreatePostPopup
        isOpen={isCreatePostOpen}
        onClose={toggleCreatePostPopup}
        onPostCreated={addNewPost}
        workspaceId={selectedWorkspace?.id} // Pass workspaceId to CreatePostPopup
      />
    </div>
  );
};


// Skeleton Loader for Feed Cards
const FeedCardSkeleton = () => {
  return (
    <div className="w-auto lg:w-[1128px] h-auto lg:h-[596px] bg-white rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
      {/* Skeleton for User Profile Section */}
      <div className="flex gap-2">
        {/* Skeleton for Profile Picture */}
        <div className="w-[56px] h-[56px] bg-gray-300 rounded-full"></div>

        {/* Skeleton for User Info */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div> {/* Title */}
          <div className="h-3 w-24 bg-gray-300 rounded"></div> {/* Person Name */}
          <div className="h-3 w-20 bg-gray-300 rounded"></div> {/* Time */}
        </div>

        {/* Skeleton for Options Button */}
        <div className="ml-auto">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Skeleton for Post Description */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>

      {/* Skeleton for Post Image */}
      <div className="w-full h-48 bg-gray-300 rounded-lg"></div>

      {/* Skeleton for Ad Image */}
      <div className="w-full h-24 bg-gray-300 rounded-lg"></div>
    </div>
  );
};

const FeedCard = ({ post }) => {
  const { title, post_description, created_at, image } = post;
  const [isApplyPopupOpen, setIsApplyPopupOpen] = useState(false);

  const toggleApplyPopup = () => {
    setIsApplyPopupOpen((prev) => !prev);
  };

  return (
    <div className="w-auto lg:w-[1128px] h-auto bg-white rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="w-[56px] h-[56px] border border-black rounded-full"></div>
        <div>
          <h1 className="font-semibold text-[16px] text-textPrimary">{title}</h1>
          <p className="text-xs font-normal">Person Name</p>
          <p className="text-xs font-normal text-textSecondary">
            {new Date(created_at).toLocaleTimeString()}
          </p>
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
                  <button className="border rounded-xl bg-blue-500 text-white" onClick={toggleApplyPopup}>
                    Apply for Job
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="text-[16px] w-auto lg:w-[672px]">{post_description}</div>

      {/* Only show the image container and image if 'image' exists */}
      {image && image !== "" && (
        <div className="w-full flex justify-center">
          <img src={image} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
        </div>
      )}

      <ApplyJobPopup
        isOpen={isApplyPopupOpen}
        onClose={toggleApplyPopup}
        post={post}
        onApplicationSubmitted={(application) => console.log("Application submitted:", application)}
      />
    </div>
  );
};






const CreatePostPopup = ({ isOpen, onClose, onPostCreated, workspaceId }) => {
  const [title, setTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [postType, setPostType] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handlePost = async () => {
    if (!workspaceId) {
      setError("No workspace selected");
      return;
    }

    const formData = new FormData();
    formData.append("workspace", workspaceId); // Use the selected workspace ID
    formData.append("title", title);
    formData.append("post_description", postDescription);
    formData.append("experience", experience);
    formData.append("post_type", postType);
    if (image) formData.append("image", image);

    try {
      const response = await api.post("/posts/create/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      onPostCreated(response.data);
      onClose();
      toast.success("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message || "Failed to create post");
      toast.error("Failed to create post");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[400px]">
        <h2 className="text-lg font-bold mb-2">Create Post</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Post Title Input */}
        <input
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* Post Description Input */}
        <textarea
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          placeholder="Post Description"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
        
        {/* Experience Dropdown */}
        <select
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Select Experience</option>
          <option value="Less than 6 months">Less than 6 months</option>
          <option value="6-12 months">6-12 months</option>
          <option value="More than 12 months">More than 1 year</option>
          <option value="More than 12 months">More than 1 years</option>
        </select>
        
        {/* Post Type Dropdown */}
        <select
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          <option value="">Select Post Type</option>
          <option value="Job Post">Job Post</option>
          <option value="Casual Post">Casual Post</option>
        </select>

        {/* Image Input */}
        <input
          className="w-full p-2 border rounded-md mb-4"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Buttons */}
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



const ApplyJobPopup = ({ isOpen, onClose, post, onApplicationSubmitted }) => {
  const [email, setEmail] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");

  const handleApply = async () => {
    const formData = new FormData();
    formData.append("post", post.id);
    formData.append("workspace", post.workspace); // Use the workspace ID from the post
    formData.append("email", email);
    formData.append("experience_level", experienceLevel);
    if (cv) formData.append("cv", cv);

    try {
      const response = await api.post("/applications/apply/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      onApplicationSubmitted(response.data);
      onClose();
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Error applying for post:", err);
      setError(err.message || "Failed to apply for post");
      toast.error("Failed to apply for post");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[400px]">
        <h2 className="text-lg font-bold mb-2">Apply for {post.title}</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          className="w-full p-2 border rounded-md mb-4"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded-md mb-4"
          type="number"
          placeholder="Experience Level (in years)"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded-md mb-4"
          type="file"
          onChange={(e) => setCv(e.target.files[0])} // Optional file upload
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
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobPopup;
