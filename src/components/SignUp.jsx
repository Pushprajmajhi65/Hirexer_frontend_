import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Import your api.js for handling requests
import toast from "react-hot-toast";
import circles from "../images/Commonimg/circles.png";
import letterSend from "../images/SignUpImages/letter_send.png";

export const SignUpPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Function to check password strength
  function passwordChecker(password) {
    let strength = 0;
    let missingCriteria = [];

    if (password.length >= 8) {
      strength++;
    } else {
      missingCriteria.push("at least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      strength++;
    } else {
      missingCriteria.push("an uppercase letter");
    }

    if (/[0-9]/.test(password)) {
      strength++;
    } else {
      missingCriteria.push("a number");
    }

    if (/[@$!%*?&]/.test(password)) {
      strength++;
    } else {
      missingCriteria.push("a special character (@, $, !, %, *, ?, &)");
    }

    setPasswordStrength(strength);
    return missingCriteria; // Return missing criteria
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password requirements
    const missingCriteria = passwordChecker(password);
    if (missingCriteria.length > 0) {
      toast.error(`Password is missing: ${missingCriteria.join(", ")}`);
      return;
    }

    try {
      // Use the correct API call method
      const response = await api.post("/auth/register/", {
        username: userName,
        email,
        password,
      });

      toast.success("Registration Completed");
      setSuccess("Registration completed successfully!");
      navigate("/onBoarding");
    } catch (err) {
      console.error('Error during registration:', err.response ? err.response.data : err);

      if (err.response) {
        const errorMessage = err.response.data?.error || "Registration failed";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }

      setSuccess("");
    }
  };

  // Render password strength bars
  const renderStrengthBars = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className={`h-2 flex-1 mx-1 rounded ${index < passwordStrength ? "bg-greenColor" : "bg-borderGray"}`}
      ></div>
    ));
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-backgroundGreen font-poppins">
      <div className="w-[90%] max-w-[512px] xl:max-w-[1098px] h-[600px] xl:h-[741px] bg-white rounded-2xl flex items-center justify-center relative p-4 xl:p-0">
        <img
          src={letterSend}
          className="absolute top-[570px] left-[450px] z-50 w-0 xl:w-[250px]"
          alt="Letter decoration"
        />
        <div className="w-full xl:w-[1002px] h-auto xl:h-[645px] bg-white flex flex-col xl:flex-row">
          <div className="hidden xl:flex xl:w-[490px] h-[645px] bg-greenColor rounded-xl justify-end items-end">
            <img className="w-[269px]" src={circles} alt="Circles decoration" />
          </div>

          <div className="w-full xl:w-[512px] h-auto xl:h-[645px] flex flex-col justify-center items-center">
            <h1 className="font-bold text-[24px] xl:text-[32px] text-textPrimary mb-[20px] xl:mb-[31px] text-center">
              Create your account
            </h1>

            <form
              className="flex flex-col gap-[16px] xl:gap-[20px] w-full max-w-[350px]"
              onSubmit={handleSubmit}
            >
              <fieldset className="border-2 rounded-md">
                <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
                  Full Name:
                </legend>
                <input
                  className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
                  type="text"
                  placeholder="Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </fieldset>

              <fieldset className="border-2 rounded-md">
                <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
                  Email:
                </legend>
                <input
                  className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </fieldset>

              <fieldset className="border-2 rounded-md">
                <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
                  Password:
                </legend>
                <input
                  className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
                  type="password"
                  placeholder="Strong Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    passwordChecker(e.target.value);
                  }}
                  required
                />
              </fieldset>

              <div className="flex flex-col items-center w-full mt-2">
                <div className="flex justify-center w-full">
                  {renderStrengthBars()}
                </div>
                <span className="w-full mt-1 text-sm text-textSecondary text-end">
                  Password Strength
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 accent-greenColor"
                  required
                />
                <label htmlFor="terms" className="text-xs text-textPrimary">
                  I agree to the{" "}
                  <a href="" className="text-greenColor">
                    Terms & conditions
                  </a>{" "}
                  and{" "}
                  <a href="" className="text-greenColor">
                    Privacy Policies
                  </a>
                  .
                </label>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="w-full h-[44px] bg-buttonBackground rounded-xl text-white font-bold text-base"
                >
                  Create my account
                </button>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
                <span className="text-[14px] text-textPrimary">
                  Already have an account?{" "}
                  <Link to="/" className="text-greenColor">
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};