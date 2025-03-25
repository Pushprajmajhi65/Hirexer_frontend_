import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Wrapper from "../Wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthIndicator from "./passwordStrengthIncicator";
import toast from "react-hot-toast";
import { useSignup } from "@/services/auth";

const SignupForm = () => {
  const { handleSubmit, reset, register, formState, watch } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();
  const password = watch("password");

  const [agreeTerms, setAgreeTerms] = useState(false);

  const signupMutation = useSignup();

  const handleTermsChange = (checked) => {
    setAgreeTerms(checked);
  };

  const onSubmit = (data) => {
    if (!agreeTerms) {
      toast.error("Please agree to the terms & conditions first.", {
        style: {
          border: "1px solid #11daaa",
          padding: "16px",
          color: "#11daaa",
        },
        iconTheme: {
          secondary: "#FFFAEE",
        },
      });
      return;
    }
    /*  console.log(data);
    console.log(BACKEND_URL) */
    signupMutation.mutate(
      {
        email: data.email,
        password: data.password,
        username: data.username,
      },
      {
        onSuccess: () => {
          reset();
          navigate("/otp", { state: { email: data.email } });
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[32px] ">
      <h2 className="text-[32px] font-[700] text-primary/80">
        Create your account
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[24px]"
      >
        <Wrapper>
          <Input
            type="text"
            id="username"
            placeholder="Name"
            className="custom_auth_input h-12"
            {...register("username", { required: "Username is required" })}
          />

          <Label
            error={errors?.username?.message}
            htmlFor="username"
            className="
      custom_auth_label
    "
          >
            Full Name
          </Label>
        </Wrapper>

        <Wrapper>
          <Label
            error={errors?.email?.message}
            htmlFor="email"
            className="
  custom_auth_label
    "
          >
            Email
          </Label>
          <Input
            placeholder="Your Email"
            type="email"
            id="email"
            className="custom_auth_input h-12"
            {...register("email", { required: "Email address is required" })}
          />
        </Wrapper>

        <Wrapper>
          <Label
            error={errors?.password?.message}
            htmlFor="password"
            className="
  custom_auth_label
    "
          >
            Password
          </Label>
          <Input
            id="password"
            className="custom_auth_input h-12"
            placeholder="Strong Password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
        </Wrapper>

        <PasswordStrengthIndicator password={password} />

        <h2 className="text-xs text-muted-foreground flex lg:items-center gap-2 ">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={handleTermsChange}
          />
          I agree to all the{" "}
          <span className="text-figmaPrimary underline">
            Terms & Conditions{" "}
          </span>
          and
          <span className="text-figmaPrimary underline"> Privacy Policies</span>
        </h2>
        <Button
          type="submit"
          className="py-5 cursor-pointer"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending
            ? "Creating your account"
            : " Create my account"}
        </Button>
      </form>
      <h2 className="text-muted-foreground text-sm">
        Already have an account?
        <Link to="/login" className="text-figmaPrimary hover:underline">
          {" "}
          Sign in
        </Link>
      </h2>
    </div>
  );
};

export default SignupForm;
