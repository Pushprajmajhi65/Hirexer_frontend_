import React from "react";
import image from "../assets/404.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen container mx-auto px-4 xl:px-0">
      <div className="h-screen flex items-center justify-center">
        <section className="h-[600px] w-[430px] flex items-center justify-center flex-col gap-6">
          <div className="text-center pb-2">
            <h1 className="font-[800] text-[40px]">Page Not Found</h1>
            <p className="font-[600] text-[16px]">
              Oops the page your are looking for could not be found{" "}
            </p>
          </div>
          <img src={image} alt="404 error image" />
          <Button
            onClick={() => navigate("/")}
            className="bg-figmaPrimaryDark cursor-pointer"
          >
            Go to Homepage
          </Button>
        </section>
      </div>
    </div>
  );
};

export default PageNotFound;
