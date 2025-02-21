import triangles from "../images/resetPageImg/triangles.png";
import circles from "../images/resetPageImg/circles.png";
import newpassimg from "../images/resetPageImg/Newpassword.png";
import continueImage from "../images/resetPageImg/continueicon.png";
import messageIcon from "../images/resetPageImg/messageIcon.png";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
export const NewPasswordSet = () => {
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract uid and token from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const uid = decodeURIComponent(searchParams.get("uid"));
  const token = decodeURIComponent(searchParams.get("token"));

  const handlePasswordChange = async () => {
    try {
      if (!newPassword) {
        setErrorMessage("Password is required.");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/password-reset/confirm/${uid}/${token}/`,
        { new_password: newPassword },
      );

      if (response.status === 200) {
        navigate("/passwordchanged");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-backgroundGreen font-poppins">
      <img
        src={triangles}
        className="w-0 xl:w-[213px] h-[163px] absolute top-0 right-0"
        alt="Triangles decoration"
      />
      <div className="w-[90%] max-w-[520px] xl:max-w-[1156px] xl:h-[559px] bg-white rounded-2xl flex items-center justify-end relative gap-20 p-4 xl:p-0">
        <div className="w-[432px] h-[357px] ml-10">
          <img
            src={messageIcon}
            className="h-[94px] ml-auto mb-10"
            alt="Message icon"
          />
          <h1 className="font-semibold text-textPrimary text-[18px] sm:text-[24px] xl:text-[32px]">
            Enter the new password
          </h1>
          <div className="border-b-2 border-borderGray w-[90%] pt-8">
            <input
              type="password"
              placeholder="New Password"
              className="outline-none text-[18px] sm:text-[24px] xl:text-[32px]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-[14px] sm:text-[16px] mt-2">
              {errorMessage}
            </p>
          )}
          <button
            onClick={handlePasswordChange}
            className="w-[150px] h-[50px] sm:w-[232px] sm:h-[56px] mt-[2.5%] xl:mt-[50px] bg-buttonBackground rounded-2xl text-[12px] sm:text-[16px] font-semibold text-white flex justify-center items-center gap-2"
          >
            Change Password
            <img
              src={continueImage}
              className="w-[20px] h-[20px]"
              alt="Continue icon"
            />
          </button>
        </div>
        <img
          src={newpassimg}
          className="h-[495px] mr-[32px] hidden xl:block"
          alt="New password illustration"
        />
      </div>
      <img
        src={circles}
        className="w-0 xl:w-[213px] h-[163px] absolute bottom-0 left-0"
        alt="Circles decoration"
      />
    </div>
  );
};
