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
        const response = await api.get("/posts/");
        setPosts(response.data); // Set posts data
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        toast.error("Failed to fetch posts");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []); // Run effect once on mount

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
          <img src={notifaction} className="w-5 h-5" alt="Notification" />
          <img src={settting} className="w-5 h-5" alt="Settings" />
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
            // Show skeleton loader for feed cards while loading
            [...Array(4)].map((_, index) => <FeedCardSkeleton key={index} />)
          ) : (
            // Show actual feed cards after loading
            posts.map((post, index) => <FeedCard key={index} post={post} />)
          )}
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


// Skeleton Loader for Feed Cards
const FeedCardSkeleton = () => {
  return (
    <div className="w-auto lg:w-[720px] h-auto lg:h-[596px] bg-white rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
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
    <div className="w-auto lg:w-[720px] h-auto lg:h-[596px] bg-white rounded-2xl p-6 flex flex-col gap-4">
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
      {image && <img src={`http://127.0.0.1:8000${image}`} className="w-auto" />}
      <img src={ad} className="w-auto" />

      <ApplyJobPopup
        isOpen={isApplyPopupOpen}
        onClose={toggleApplyPopup}
        post={post}
        onApplicationSubmitted={(application) => console.log("Application submitted:", application)}
      />
    </div>
  );
};



const CreatePostPopup = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [experience, setExperience] = useState(""); // For the 'experience' field
  const [postType, setPostType] = useState(""); // For the 'post_type' field
  const [image, setImage] = useState(null); // For image upload
  const [error, setError] = useState("");

  const handlePost = async () => {
    setError("");
  
    // Validate input fields
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
  
    const formData = new FormData();
    formData.append("workspace", 4); // Static value, update if needed
    formData.append("title", title);
    formData.append("post_description", postDescription);
    formData.append("experience", experience);
    formData.append("post_type", postType);
    
    if (image) {
      formData.append("image", image); // Add the file as well
    }
  
    try {
      const response = await api.post("/posts/create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' is not required when using FormData
        },
      });
  
      if (!response.data) {
        throw new Error("Failed to create post");
      }
  
      const newPost = response.data;
      setTitle("");
      setPostDescription("");
      setExperience("");
      setPostType("");
      setImage(null);
  
      onPostCreated(newPost);
      onClose();
      toast.success("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message || "An error occurred while creating the post.");
      toast.error("Failed to create post");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-[400px]">
        <h2 className="text-lg font-bold mb-2">Create Post</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded-md mb-4 focus:outline-blue-500"
          type="text"
          placeholder="Post Type (e.g., Job, Casual)"
          value={postType}
          onChange={(e) => setPostType(e.target.value)} // Handle post_type input
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


const ApplyJobPopup = ({ isOpen, onClose, post, onApplicationSubmitted }) => {
  const [email, setEmail] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [cv, setCv] = useState(null); // For file upload (optional)
  const [error, setError] = useState("");

  const handleApply = async () => {
    setError("");

    // Validate input fields
    if (!email.trim()) {
      setError("Email cannot be empty");
      return;
    }

    if (!experienceLevel.trim()) {
      setError("Experience level cannot be empty");
      return;
    }

    // No need to validate cv as it's optional
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You are not authorized. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("post", post.id); // ID of the post you're applying to
    formData.append("user", post.user_id); // Assuming you have the user's ID from the post details
    formData.append("email", email);
    formData.append("experience_level", experienceLevel);

    // Append cv to formData if it's available
    if (cv) {
      formData.append("cv", cv);
    }

    try {
      const response = await api.post("/applications/apply/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error("Failed to submit application");
      }

      // Reset form fields and close popup
      setEmail("");
      setExperienceLevel("");
      setCv(null);

      // Notify parent component
      onApplicationSubmitted(response.data);
      onClose();
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Error applying for post:", err);
      setError(err.message || "An error occurred while submitting the application.");
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
