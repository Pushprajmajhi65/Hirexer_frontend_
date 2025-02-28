import circles from "../images/Commonimg/circles.png";
import letterSend from "../images/Loginimg/letter_send_inverted.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../api";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Handle form submission for login
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login/', { email, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate("/overview");
      toast.success("Loged In");

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      toast.error("Wrong Password or Email");
      setSuccess(""); // Clear any previous success messages
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen font-poppins">
      {/* Main responsive container */}
      <div className="w-[90%] max-w-[512px] xl:max-w-[1098px] h-[500px] xl:h-[741px] bg-white rounded-2xl flex flex-col items-center justify-center relative p-4 xl:p-0">
        {/* Decorative image for larger screens */}
        <img
          src={letterSend}
          className="absolute top-[570px] left-[300px] z-50 w-0 xl:w-[250px]"
          alt="Letter decoration"
        />

        <div className="w-full xl:w-[1002px] h-auto xl:h-[645px] bg-white flex xl:flex-row">
          {/* Form section */}
          <div className="w-full xl:w-[512px] h-auto xl:h-[645px] flex flex-col justify-center items-center">
            <h1 className="font-bold text-[24px] xl:text-[32px] text-textPrimary mb-[15px] xl:mb-[31px] text-center">
              Log in
            </h1>

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-[16px] xl:gap-[19px] w-full max-w-[350px]"
            >
              {/* Input fields */}
              <fieldset className="border-2 rounded-md">
                <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
                  Email:
                </legend>
                <input
                  className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
                  type="email"
                  name="email"
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
                  name="password"
                  placeholder="Strong Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </fieldset>

              {/* Error and Success messages */}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}

              {/* Remember me, Forget Password */}
              <div className="flex flex-col items-center justify-end gap-2 text-sm sm:flex-row">
                <div className="flex items-center gap-2 mr-auto">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="w-4 h-4 accent-primary"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-textPrimary text-[14px]"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="w-full font-semibold text-highlight sm:w-auto"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Submit button */}
              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="w-full h-[44px] bg-buttonBackground rounded-xl text-white font-bold text-base"
                >
                  Log in
                </button>
                <span className="text-[14px] text-textPrimary">
                  Don’t have an account?{" "}
                  <Link to="/Sign-up" className="text-greenColor">
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Right decorative section, hidden on small screens */}
          <div className="hidden xl:flex xl:w-[490px] h-[645px] bg-greenColor rounded-xl justify-end items-end">
            <img className="w-[269px]" src={circles} alt="Circles decoration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
