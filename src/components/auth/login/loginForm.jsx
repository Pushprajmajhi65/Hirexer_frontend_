import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Wrapper from "../Wrapper";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogin } from "@/services/auth";

const LoginForm = () => {
  const { handleSubmit, reset, register, formState } = useForm({
    defaultValues: {
      remember: false,
    },
  });
  const { errors } = formState;

  const mutation = useLogin();

  const onSubmit = (data) => {
    /* console.log(data); */
    mutation.mutate(
      { email: data.email, password: data.password, remember: data.remember },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
};
  return (
    <div className="flex flex-col items-center justify-center gap-[32px] ">
      <h2 className="text-[32px] font-[700] text-primary/80">Log in</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[24px] w-full xl:px-16"
      >
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

        <section className="text-[14px] flex items-center justify-between">
          <label className="text-muted-foreground flex items-center gap-1 ">
            <input
              type="checkbox"
              {...register("remember")}
              className="rounded border-gray-300 text-figmaPrimary focus:ring-figmaPrimary"
            />
            Remember me
          </label>
          <NavLink
            to="/resetpassword"
            className="text-figmaPrimary font-semibold hover:underline"
          >
            Forgot password?
          </NavLink>
           
        </section>
        <Button
          type="submit"
          className="py-5 cursor-pointer font-semibold"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in" : "Log in"}
        </Button>
      </form>

  
      <h2 className="text-muted-foreground text-sm">
        Don't have an account?
        <NavLink
          to="/signup"
          className="text-figmaPrimary font-semibold hover:underline"
        >
          {" "}
          Sign up
        </NavLink>
       <NavLink
            to="/VerifyEmail"
            className="text-figmaPrimary font-semibold hover:underline pl-2"
          >
            Verify email
          </NavLink>
      </h2>
    </div>
  );
};

export default LoginForm;
