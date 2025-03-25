import React from "react";
import SignupForm from "@/components/auth/signup/SignupForm";
import AuthImageDialog from "@/components/shared/AuthImageDialog";
import { Card, CardContent } from "@/components/ui/card";
import chainArrow from '../assets/chainArrow.png'

const Signup = () => {
  return (
    <div className="bg-figmaBackground h-screen  flex items-center justify-center px-4 xl:px-0">
      <div className=" ">
        <Card className="xl:w-[1098px] xl:h-[741px] px-2 md:px-5 py-10 relative overflow-hidden" >
          <CardContent className="grid md:grid-cols-2 md:gap-4 lg:gap-2 items-center  ">
            <AuthImageDialog />
            <SignupForm />
          </CardContent>
           <img src={chainArrow} alt="chain arrow image"  className="absolute -bottom-14 left-[450px] h-60 "/>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
