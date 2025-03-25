import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AuthImageDialog from "@/components/shared/AuthImageDialog";
import LoginForm from "@/components/auth/login/loginForm";
import chainArrow from '../assets/chainArrow.png'

const Login = () => {
  return (
    <div className="bg-figmaBackground h-screen flex items-center justify-center px-4 xl:px-0">
      <Card className="xl:w-[1098px] xl:h-[741px] px-2 md:px-5 py-10 w-full relative overflow-hidden">
        <CardContent className="grid md:grid-cols-2 md:gap-4 lg:gap-6 items-center   ">
          <LoginForm />
          <AuthImageDialog />
        </CardContent>
          <img src={chainArrow} alt="chain arrow image"  className="absolute hidden xl:flex -bottom-14 left-[300px] h-60  rotate-y-[148deg]"/>
      </Card>
    </div>
  );
};

export default Login;
