import React from "react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import resetImage from "../assets/resetPassword.png";
import triangles from "../assets/triangles.png";
import dots from "../assets/dots.png";
import {  useParams } from "react-router-dom";
import { useVerifyResetPasswordOTP } from "@/services/auth";

const ResetPasswordOTP = () => {
  const { register, handleSubmit, reset } = useForm();

  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email);
  console.log(decodedEmail);

  const mutation = useVerifyResetPasswordOTP();

  const onSubmit = (data) => {
    /*   console.log(data, decodedEmail); */
    mutation.mutate({
      email: decodedEmail,
      otp: Number(data.otp),
      new_password: data.new_password,
    });
  };
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
        <Card className="md:w-[745px] md:h-[836px] p-2 md:p-[48px] flex flex-col gap-[40px] z-10">
          <img src={resetImage} alt="reset password image" />
          <h2 className="font-[600] text-[32px] text-primary/80 text-center">
            Enter the OTP & new password
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col gap-[32px]"
          >
            <input
              id="otp"
              type="text"
              disabled={mutation.isPending}
              placeholder="Please check your mail"
              className="custom_otp_input placeholder:text-center text-center"
              {...register("otp", { required: "OTP is required" })}
            />
            <input
              id="new_password"
              type="password"
              disabled={mutation.isPending}
              placeholder="Enter new password"
              className="custom_otp_input placeholder:text-center text-center"
              {...register("new_password", {
                required: "New password is required",
              })}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 py-6 font-semibold cursor-pointer"
            >
              {mutation.isPending ? "Verifying" : "Verify"}
              <ChevronRight />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordOTP;
