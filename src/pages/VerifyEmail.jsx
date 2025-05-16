import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import diamond from "../assets/diamond.png";
import crown from "../assets/crown.png";
import curve from "../assets/curve.png";
import dots from "../assets/dots.png";
import mes from "../assets/mes.png";
import { Button } from "@/components/ui/button";
import triangles from "../assets/triangles.png";
import otpman from "../assets/otpman.png";
import { useForm } from "react-hook-form";
import { ChevronRight } from "lucide-react";
import { useVerifyOTP, useResendOTP } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification
  const [email, setEmail] = useState("");
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const verifyMutation = useVerifyOTP();
  const resendMutation = useResendOTP();

  // Handle email submission to send OTP
  const handleEmailSubmit = (data) => {
    setEmail(data.email);
    resendMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          toast.success("OTP sent successfully");
          setStep(2);
          reset();
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.error || "Failed to send OTP. Try again."
          );
        },
      }
    );
  };

  // Handle OTP verification
  const handleOtpSubmit = (data) => {
    verifyMutation.mutate(
      { otp: data.otp, email },
      {
        onSuccess: () => {
          toast.success("Email verified successfully");
          navigate("/login");
        },
      }
    );
  };

  // Handle OTP resend
  const handleResend = () => {
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP resent successfully");
        reset();
        setStep(2);
        toast.success("New OTP sent to your email");
        reset();
      },
        onError: (error) => {
          toast.error(
            error?.response?.data?.error || "Failed to resend OTP. Try again."
          );
        },
      }
    );
  };

  return (
    <div className="bg-figmaBackground h-screen flex items-center justify-center px-4 xl:px-0 relative overflow-hidden">
      <Card className="xl:w-[1098px] xl:h-[545px] px-2 md:px-5 relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-2 items-center justify-center h-full">
          <div className="relative h-full flex flex-col items-start justify-center gap-[32px] mt-30">
            {step === 1 ? (
              <>
                <h1 className="font-[600] text-[32px] text-primary/80">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground">
                  Enter your email address to receive a verification code
                </p>

                <img
                  src={mes}
                  alt="message"
                  className="w-50 absolute right-20 md:right-0 -top-10 xl:top-10"
                />

                <form
                  onSubmit={handleSubmit(handleEmailSubmit)}
                  className="flex items-start flex-col gap-[32px] w-full"
                >
                  <div className="w-full">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="custom_otp_input w-full"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={resendMutation.isPending}
                    className="flex items-center gap-2 py-6 font-semibold w-full"
                  >
                    {resendMutation.isPending ? "Sending..." : "Send OTP"}
                    <ChevronRight />
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h1 className="font-[600] text-[32px] text-primary/80">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground">
                  Enter the OTP sent to {email}
                </p>

                <form
                  onSubmit={handleSubmit(handleOtpSubmit)}
                  className="flex items-start flex-col gap-[32px] w-full"
                >
                  <div className="w-full">
                    <input
                      id="otp"
                      placeholder="Enter OTP"
                      className="custom_otp_input w-full"
                      {...register("otp", {
                        required: "OTP is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "OTP must be 6 digits",
                        },
                      })}
                    />
                    {errors.otp && (
                      <span className="text-red-500 text-sm">
                        {errors.otp.message}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4 w-full">
                    <Button
                      type="submit"
                      disabled={verifyMutation.isPending}
                      className="flex items-center gap-2 py-6 font-semibold flex-1"
                    >
                      {verifyMutation.isPending ? "Verifying..." : "Verify"}
                      <ChevronRight />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={resendMutation.isPending}
                      onClick={handleResend}
                      className="flex-1"
                    >
                      {resendMutation.isPending ? "Resending..." : "Resend OTP"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="hidden md:flex items-end justify-end h-full relative">
            <img
              src={otpman}
              alt="otpman"
              className="absolute h-40 xl:h-72 left-8"
            />
            <img
              src={crown}
              alt="crown"
              className="h-20 right-20 top-10 xl:top-30 absolute"
            />
            <img
              src={diamond}
              alt="diamond"
              className="absolute top-4 xl:top-36 rotate-[330deg] h-20 left-8"
            />
            <img
              src={dots}
              alt="dots"
              className="bottom-0 absolute h-30 xl:h-40 -right-10"
            />
            <img src={curve} alt="curve" className="object-cover" />
          </div>
        </div>
      </Card>

      <img
        src={dots}
        alt="dots"
        className="left-0 bottom-0 absolute h-60 w-90"
      />
      <img
        src={triangles}
        alt="triangles"
        className="absolute top-0 right-0 h-40"
      />
      <img
        src={diamond}
        alt="diamond"
        className="absolute top-20 h-20 xl:left-[550px]"
      />
    </div>
  );
};

export default VerifyEmail;