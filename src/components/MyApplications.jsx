import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import Lottie from "react-lottie";
import NODATA from "../assets/NODATA.json";
import error404 from "../assets/error404.json";
import { toast } from "react-hot-toast";
import { NavBar, SmallScreenNavBar } from "./UserOverview";

const MyApplications = () => {
  const [showNavBar, setShowNavBar] = useState(false); // State to toggle SmallScreenNavBar

  // Fetch applications for the current user
  const {
    data: applications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const response = await api.get("my-applications/");
      return response.data;
    },
  });

  // Toggle SmallScreenNavBar
  const toggleNavBar = () => {
    setShowNavBar(!showNavBar);
  };

  // Lottie animation options
  const noDataOptions = {
    loop: true,
    autoplay: true,
    animationData: NODATA,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const errorOptions = {
    loop: true,
    autoplay: true,
    animationData: error404,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-screen bg-gray-100">
        {/* Sidebar (NavBar) */}
        <div className="hidden xl:block">
          <NavBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Toggle Button for SmallScreenNavBar */}
          <button
            className="xl:hidden fixed top-4 left-4 z-30 p-2 bg-[#1ED0C2] rounded-lg shadow-md"
            onClick={toggleNavBar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Application Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
                >
                  {/* Application Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="bg-gray-300 h-6 w-3/4 rounded animate-pulse"></h2>
                    <span className="bg-gray-300 h-6 w-1/4 rounded-full animate-pulse"></span>
                  </div>

                  {/* Workspace Name */}
                  <p className="bg-gray-300 h-4 w-1/2 rounded mb-2 animate-pulse"></p>

                  {/* Post Description */}
                  <p className="bg-gray-300 h-4 w-full rounded mb-2 animate-pulse"></p>
                  <p className="bg-gray-300 h-4 w-3/4 rounded mb-2 animate-pulse"></p>

                  {/* Experience Level */}
                  <p className="bg-gray-300 h-4 w-1/3 rounded mb-2 animate-pulse"></p>

                  {/* Applicant Email */}
                  <p className="bg-gray-300 h-4 w-2/3 rounded mb-2 animate-pulse"></p>

                  {/* Applied At */}
                  <p className="bg-gray-300 h-4 w-1/2 rounded mb-4 animate-pulse"></p>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <button className="bg-gray-300 h-10 w-24 rounded-lg animate-pulse"></button>
                    <button className="bg-gray-300 h-10 w-24 rounded-lg animate-pulse"></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Lottie options={errorOptions} height={300} width={300} />
        <p className="text-xl text-gray-600 mt-4">Failed to load applications. Please try again later.</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Lottie options={noDataOptions} height={300} width={300} />
        <p className="text-xl text-gray-600 mt-4">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar (NavBar) */}
      <div className="hidden xl:block">
        <NavBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Toggle Button for SmallScreenNavBar */}
        <button
          className="xl:hidden fixed top-4 left-4 z-30 p-2 bg-[#1ED0C2] rounded-lg shadow-md"
          onClick={toggleNavBar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* SmallScreenNavBar (Conditional Rendering) */}
        {showNavBar && (
          <div className="xl:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={toggleNavBar}>
            <div className="w-64 h-full bg-white">
              <SmallScreenNavBar />
            </div>
          </div>
        )}

        {/* Application Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
              >
                {/* Application Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {application.post_title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.application_status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : application.application_status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.application_status}
                  </span>
                </div>

                {/* Workspace Name */}
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Workspace:</span> {application.post_workspace_name}
                </p>

                {/* Post Description */}
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Description:</span> {application.post_description}
                </p>

                {/* Experience Level */}
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Experience:</span> {application.experience_level} years
                </p>

                {/* Applicant Email */}
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Email:</span> {application.email}
                </p>

                {/* Applied At */}
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Applied On:</span>{" "}
                  {new Date(application.applied_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    className="text-[#1ED0C2] hover:text-[#1AAE9F] transition-colors duration-300"
                    onClick={() => {
                      // Add functionality to view application details
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    onClick={() => {
                      // Add functionality to delete application
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;