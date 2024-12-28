import { useState } from "react";
import axios from "axios"; // Import axios for API requests
import resetImage from "../images/resetPageImg/reset.png";
import continueImage from "../images/resetPageImg/continueicon.png";
import triangles from "../images/resetPageImg/triangles.png";
import circles from "../images/resetPageImg/circles.png";
import { Link } from "react-router-dom";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission when the "Send Email" button is clicked
  const handleSendEmail = async () => {
    // Reset previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate email
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/password-reset/",
        { email },
      );

      // Check if the response is successful
      if (response.status === 200) {
        setSuccessMessage(
          response.data.message || "Password reset link sent successfully!",
        );
      }
    } catch (error) {
      if (error.response) {
        // If there is a response error
        setErrorMessage(error.response.data.error || "Something went wrong.");
      } else {
        // If there is a network error
        setErrorMessage("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-backgroundGreen w-screen h-screen font-['Poppins'] flex justify-center items-center relative">
      {/* Top Decorative Image */}
      <img
        src={triangles}
        className="w-[150px] h-[115px] sm:w-[213px] sm:h-[163px] absolute top-0 right-0"
      />

      {/* Main Container */}
      <div className="w-[90%] max-w-[400px] sm:max-w-[512px] lg:max-w-[600px] xl:max-w-[743px] h-auto bg-white rounded-2xl flex flex-col items-center p-6 sm:p-8 relative">
        {/* Reset Image */}
        <img
          src={resetImage}
          className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] p-4"
          alt="Reset illustration"
        />

        {/* Text and Input Section */}
        <div className="flex flex-col gap-[12px] sm:gap-[16px] mt-[24px] sm:mt-[36px]">
          <h1 className="text-[20px] sm:text-[24px] lg:text-[30px] font-extrabold leading-[28px] sm:leading-[32px] lg:leading-[38px] text-textPrimary text-center">
            Request for Password Reset
          </h1>
          <div className="flex flex-col items-center w-full">
            {/* Email Input */}
            <div className="border-b-2 border-borderGray w-full max-w-[300px] sm:max-w-[400px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email@gmail.com"
                className="outline-none text-[16px] sm:text-[18px] lg:text-[20px] w-full py-2"
              />
            </div>

            {/* Success or Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm mt-2">
                {successMessage}
              </div>
            )}

            {/* Send Email Button */}
            <button
              onClick={handleSendEmail}
              className="w-[120px] sm:w-[140px] lg:w-[159px] h-[40px] sm:h-[48px] lg:h-[56px] mt-[20px] sm:mt-[30px] xl:mt-[50px] bg-buttonBackground rounded-2xl text-[14px] sm:text-[16px] font-semibold text-white flex justify-center items-center gap-2"
            >
              Send Email
              <img
                src={continueImage}
                className="w-[16px] sm:w-[18px] lg:w-[20px] h-[16px] sm:h-[18px] lg:h-[20px]"
                alt="Arrow"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Image */}
      <img
        src={circles}
        className="w-[150px] h-[115px] sm:w-[213px] sm:h-[163px] absolute bottom-0 left-0"
      />
    </div>
  );
};
