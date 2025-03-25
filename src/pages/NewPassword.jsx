import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import diamond from "../assets/diamond.png";
import crown from "../assets/crown.png";
import curve from "../assets/curve.png";
import dots from "../assets/dots.png";
import mes from "../assets/mes.png";
import triangles from "../assets/triangles.png";
import otpman from "../assets/otpman.png";

const NewPassword = () => {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-figmaBackground h-screen flex items-center justify-center px-4 xl:px-0 relative overflow-hidden">
      <Card className="xl:w-[1098px] xl:h-[545px] px-2 md:px-5  relative overflow-hidden">
        <div className="grid md:grid-cols-2  gap-2 items-center justify-center h-full">
          <div className="relative h-full flex flex-col items-start  justify-center gap-[32px] mt-30">
            <h1 className="font-[600] text-[32px] text-primary/80">
              Enter the new password
            </h1>

            <img
              src={mes}
              alt="message image"
              className="w-50 absolute right-20 md:right-0 -top-10 xl:top-10"
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-start flex-col gap-[32px]"
            >
              <input
                id="otp"
                placeholder="New Password"
                className="custom_otp_input"
                {...register("password", { required: "password is required" })}
              />

              <Button
                type="submit"
                className="flex items-center gap-2 py-6 font-semibold cursor-pointer"
              >
                Change Password
                <ChevronRight />
              </Button>
            </form>
          </div>
          <div className="hidden md:flex items-end justify-end h-full relative">
            <img
              src={otpman}
              alt="otpman image"
              className="absolute h-40 xl:h-72 left-8"
            />
            <img
              src={crown}
              alt="crown image"
              className="h-20 right-20 top-10 xl:top-30 absolute"
            />
            <img
              src={diamond}
              alt="diamong image"
              className=" absolute top-4  xl:top-36 rotate-[330deg] h-20 left-8"
            />
            <img
              src={dots}
              alt="dots image"
              className=" bottom-0 absolute h-30 xl:h-40 -right-10"
            />
            <img src={curve} alt="curve background" className="object-cover" />
          </div>
        </div>
      </Card>
      <img
        src={dots}
        alt="dots image"
        className="left-0 bottom-0 absolute h-60 w-90"
      />
      <img
        src={triangles}
        alt="triangle image"
        className="absolute top-0 right-0 h-40"
      />
      <img
        src={diamond}
        alt="diamong image"
        className=" absolute top-20 h-20 xl:left-[550px]"
      />
    </div>
  );
};

export default NewPassword;
