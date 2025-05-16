import React from "react";
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
import { useLocation } from "react-router-dom";

const SignupOTP = () => {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const location = useLocation();

  const email = location.state?.email || "";
  const verifyMutation = useVerifyOTP();
  const resendMutation = useResendOTP();

  const onSubmit = (data) => {
    verifyMutation.mutate(
      { otp: data.otp, email },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    resendMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "OTP has been resent to your email");
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
            <h1 className="font-[600] text-[32px] text-primary/80">
              We have sent an OTP to your email
            </h1>
            <p className="text-muted-foreground">
              Enter the OTP sent to {email || "your email"}
            </p>

            <img
              src={mes}
              alt="message"
              className="w-50 absolute right-20 md:right-0 -top-10 xl:top-10"
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
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
                      message: "OTP must be 6 digits"
                    }
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
          </div>

          {/* ... rest of the component remains the same ... */}
        </div>
      </Card>
    </div>
  );
};

export default SignupOTP;