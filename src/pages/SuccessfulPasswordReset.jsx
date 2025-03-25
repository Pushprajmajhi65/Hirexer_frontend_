import React from "react";
import { Card } from "@/components/ui/card";
import successfulreset from "../assets/successfulreset.png";
import triangles from "../assets/triangles.png";
import dots from "../assets/dots.png";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const SuccessfulPasswordReset = () => {
  return (
    <div className="bg-figmaBackground h-screen px-4 xl:px-0 relative overflow-hidden">
      <img
        src={triangles}
        alt="triangle images"
        className="absolute  right-0 top-0 h-40"
      />
      <img
        src={dots}
        alt="dotted image"
        className=" absolute left-0 bottom-0 h-60"
      />
      <div className="container mx-auto flex items-center justify-center h-full ">
        <Card className="md:w-[745px] md:h-[836px] p-2 md:p-[48px] flex flex-col items-center gap-[40px] z-10">
          <img src={successfulreset} alt="reset password image" />
          <h2 className="font-[600] text-[32px] text-primary/80 text-center">
            You are all set <br />
            Your Password has been changed
          </h2>
          <Button className="w-32 h-12">
            <NavLink to="/login">Back to login</NavLink>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SuccessfulPasswordReset;
