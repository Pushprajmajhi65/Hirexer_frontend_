import circles from "../images/Commonimg/circles.png";
import letterSend from "../images/Loginimg/letter_send_inverted.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { auth, provider, signInWithPopup } from "../firebase";
import { getAuth } from "firebase/auth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Handle manual login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login/", { email, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/overview");
      toast.success("Logged In");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      toast.error("Wrong Password or Email");
      setSuccess(""); // Clear any previous success messages
    }
  };

  // Handle Google login
 // Handle Google login
 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Send Firebase token to Django backend for validation
    const idToken = await user.getIdToken();
    const response = await fetch("http://127.0.0.1:8000/firebase-login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),  // Send Firebase ID token
    });

    const data = await response.json();
    if (response.ok) {
      // Save tokens and user data to localStorage
      localStorage.setItem("access_token", data.access_token);  // Access token from backend
      localStorage.setItem("refresh_token", data.refresh_token);  // Refresh token from backend
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_name", data.user_name || "");
      localStorage.setItem("user_uid", data.uid);

      toast.success("Logged in with Google");
      navigate("/overview");
    } else {
      toast.error(data.error || "Google Login failed");
    }
  } catch (error) {
    console.error("Error during Google login:", error);
    toast.error("Google login failed");
  }
};
  return (
    <div className="flex items-center justify-center w-screen h-screen font-poppins">
      <div className="w-[90%] max-w-[512px] xl:max-w-[1098px] h-[500px] xl:h-[741px] bg-white rounded-2xl flex flex-col items-center justify-center relative p-4 xl:p-0">
        <img
          src={letterSend}
          className="absolute top-[570px] left-[300px] z-50 w-0 xl:w-[250px]"
          alt="Letter decoration"
        />

        <div className="w-full xl:w-[1002px] h-auto xl:h-[645px] bg-white flex xl:flex-row">
          <div className="w-full xl:w-[512px] h-auto xl:h-[645px] flex flex-col justify-center items-center">
            <h1 className="font-bold text-[24px] xl:text-[32px] text-textPrimary mb-[15px] xl:mb-[31px] text-center">
              Log in
            </h1>

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-[16px] xl:gap-[19px] w-full max-w-[350px]"
            >
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

              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}

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

              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="w-full h-[44px] bg-buttonBackground rounded-xl text-white font-bold text-base"
                >
                  Log in
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-[44px] bg-red-500 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign in with Google
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

          <div className="hidden xl:flex xl:w-[490px] h-[645px] bg-greenColor rounded-xl justify-end items-end">
            <img className="w-[269px]" src={circles} alt="Circles decoration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;