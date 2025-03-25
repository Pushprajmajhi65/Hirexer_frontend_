import React from "react";
import setupDone from "../assets/setupdone.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const WorkspaceSetupdone = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center px-4 xl:px-0">
      <div className="w-[750px] md:h-[650px]">
        <img src={setupDone} alt="setup done image" />
        <section className="text-center flex flex-col items-center gap-1">
          <h1 className="font-[700] text-[48px]">You’re all set!</h1>
          <p className="text-muted-foreground text-[16px]">
            Explore Hirexer and make your first hire convenient
          </p>
          <Button
            className="h-10 cursor-pointer w-[200px]"
            onClick={() => navigate("/overview")}
          >
            Let's get started <ChevronRight />
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WorkspaceSetupdone;
