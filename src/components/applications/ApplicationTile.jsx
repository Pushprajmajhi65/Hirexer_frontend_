import React from "react";
import { Card, CardContent } from "../ui/card";
import { NavLink } from "react-router-dom";

const ApplicationTile = ({ application }) => {
  // Truncate description to 100 characters
  const truncateDescription = (text) => {
    if (!text) return "";
    if (text.length <= 100) return text;
    return text.substring(0, 200) + "...";
  };

  return (
    <Card className="w-full h-[320px] sm:h-[340px] md:h-[360px] max-w-[350px] px-5 py-6 relative group hover:shadow-md transition-shadow duration-200">
      {/* Top accent bar */}
      <span className="h-[6px] w-full bg-figmaPrimary absolute top-0 left-0 rounded-t-lg"></span>
      
      <CardContent className="h-full flex flex-col">
        {/* Icon section with visual hierarchy */}
        <div className="mb-6 relative flex items-center">
          <div className="relative h-16 w-16">
            <div className="absolute -top-2 -left-2 h-full w-full rounded-full bg-figmaPrimary/10"></div>
            <div className="relative flex items-center justify-center h-full w-full">
              <div className="h-10 w-10 bg-figmaPrimary rounded-lg flex items-center justify-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-grow space-y-3">
          <h2 className="text-xl font-bold text-primary/90">
            {application.title}
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-4">
            {truncateDescription(application.post_description)}
          </p>
        </div>

        {/* Footer link with subtle animation */}
        <div className="mt-4 pt-4">
          <NavLink
            to={`/myapplications/${application.id}`}
            className="text-figmaPrimary font-medium text-sm flex items-center group"
          >
            View Applications
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTile;