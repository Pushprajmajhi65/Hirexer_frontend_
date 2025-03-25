import React from "react";
import welcome from "../assets/welcome.png";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const OnBoarding = () => {
  return (
    <div className="bg-figmaBackground h-screen px-4 xl:px-0 flex items-center">
      <div className="container mx-auto max-w-7xl">
        <div className="grid  md:grid-cols-2 w-full xl:max-w-[1320px] xl:min-h-[790px] items-center justify-center rounded-md overflow-hidden shadow-lg">
          {/* Left Side - Image */}
          <div className="bg-white flex justify-center items-center h-full">
            <img src={welcome} alt="welcome" className="object-cover" />
          </div>

          {/* Right Side - Content */}
          <div className="bg-figmaPrimaryDark flex flex-col justify-center items-start text-white p-8 space-y-4 md:space-y-6 h-full">
            <h1 className="text-4xl xl:text-[65px] font-[700]">
              Your Next Big Opportunity Awaits – Let’s Get Started!
            </h1>
            <p className="md:text-lg">
              Hirexer makes hiring effortless. Create a professional profile,
              post job listings, and manage applicants with ease. Streamline
              your recruitment process and share a personalized hiring portal to
              find the right fit faster. Get started today!
            </p>
            <NavLink to="/createworkspace">
              <Button className="py-6 cursor-pointer flex items-center gap-2">
                {" "}
                Get Started <ChevronRight />
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
