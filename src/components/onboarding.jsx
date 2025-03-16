import continueImage from "../images/onBoarding/continueBlack.png";
import welcome from "../images/onBoarding/Welcome.png";

import add from "../images/onBoarding/add.png";
import group from "../images/onBoarding/groupimg.png";
import { Link, } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import Lottie from 'react-lottie';

import SUCESS from "../assets/success.json";





export const OnBoardingOne = () => {
  return (
    <div className="relative flex items-center justify-center w-screen h-screen font-poppins">
      {/* Main Container */}
      <div className="w-[90%] max-w-[1320px] h-[90%] bg-white flex flex-col lg:flex-row items-center justify-end rounded-2xl p-4 lg:p-0 xl:p-0 relative">
        {/* Left Section: Image */}
        <div className="w-full lg:w-[50%] xl:w-[588px] flex items-center justify-center mb-6 lg:mb-0">
          <img
            src={welcome}
            className="w-[75%] sm:w-[250px] hidden lg:flex lg:w-[300px] xl:w-[400px] max-w-full h-auto"
            alt="Welcome"
          />
        </div>

        {/* Right Section: Content */}
        <div className="w-full lg:w-[60%] xl:w-[64%] h-full bg-[#57ACB2] rounded-2xl lg:rounded-r-2xl flex flex-col justify-center items-center p-20">
          <div className="max-w-[636px] text-center lg:text-left">
            {/* Heading */}
            <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] xl:text-[72px] font-bold text-white leading-tight">
              Your Next Big
              <br />
              Opportunity <br />
              Awaits – Let’s Get
              <br /> Started!
            </h1>

            {/* Description */}
            <p className="text-white mt-4 max-w-[500px] text-sm sm:text-base xl:text-lg">
              Hirexer makes hiring effortless. Create a professional profile,
              post job listings, and manage applicants with ease. Streamline
              your recruitment process and share a personalized hiring portal to
              find the right fit faster. Get started today!
            </p>

            {/* Button */}
            <div className="flex justify-center lg:justify-start">
              <Link to="/Onboarding-phase-one">
                <button className="w-[140px] sm:w-[150px] lg:w-[177px] h-[40px] sm:h-[50px] lg:h-[56px] mt-6 lg:mt-10 bg-white rounded-xl sm:rounded-2xl text-textPrimary text-[12px] sm:text-[14px] lg:text-[16px] font-semibold flex justify-center items-center gap-2">
                  Get Started
                  <img
                    src={continueImage}
                    className="w-[16px] sm:w-[18px] lg:w-[20px] h-[16px] sm:h-[18px] lg:h-[20px]"
                    alt="Continue"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const OnBoardingTwo = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [success, setSuccess] = useState(""); // Add success state
  const [error, setError] = useState(""); // Add error state

  const navigate = useNavigate();

  const createWorkspace = async () => {
    navigate("/Onboarding-phase-two");
    try {
      const token = localStorage.getItem("access_token");

      const workspaceData = {
        name: workspaceName,
        email,
        country,
        industry,
        phone_number: phoneNumber,
      };

      const response = await api.post("/create-workspace/", workspaceData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
      });

      setSuccess("Workspace created successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Workspace creation failed");
      setSuccess("");
      navigate("/Onboarding-phase-two");
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen px-4 overflow-hidden font-poppins sm:px-8 md:px-10 lg:px-12">
      <div className="w-full max-w-[552px] lg:max-w-[552px] h-auto flex flex-col items-center justify-center">
        <div className="flex flex-col w-full h-auto px-4 py-6 bg-white shadow-lg rounded-2xl md:px-8 lg:px-10 md:py-8 lg:py-10">
          <div className="flex flex-col items-center w-full">
            <img
              // src={mailCard}
              className="w-20 sm:w-24 md:w-28 lg:w-32"
              alt="https://www.google.com/imgres?q=icon&imgurl=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190530%2Fourmid%2Fpngtree-correct-icon-image_1267804.jpg&imgrefurl=https%3A%2F%2Fpngtree.com%2Fso%2Ficon&docid=PHhCM75cI9fiwM&tbnid=6DcwHBK5gb1KLM&vet=12ahUKEwje2YbGi62KAxVuTWcHHYiNPOcQM3oECGQQAA..i&w=360&h=360&hcb=2&ved=2ahUKEwje2YbGi62KAxVuTWcHHYiNPOcQM3oECGQQAA"
            />
            <h1 className="text-center text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-semibold mt-4">
              Let's Start with your
              <br /> Onboarding
            </h1>
            <form className="flex flex-col w-full mt-6" onSubmit={createWorkspace}>
  <fieldset className="border-2 rounded-md mb-4">
    <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
      Workspace Name:
    </legend>
    <input
      className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
      type="text"
      value={workspaceName}
      onChange={(e) => setWorkspaceName(e.target.value)}
      placeholder="e.g., John’s Bakery"
      required
    />
  </fieldset>

  <fieldset className="border-2 rounded-md mb-4">
    <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
      Email:
    </legend>
    <input
      className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Yourmail@gmail.com"
      required
    />
  </fieldset>

  <fieldset className="border-2 rounded-md mb-4">
    <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
      Country:
    </legend>
    <input
      className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
      type="text"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      placeholder="Nepal"
      required
    />
  </fieldset>

  <fieldset className="border-2 rounded-md mb-4">
    <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
      Industry:
    </legend>
    <select
      className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
      value={industry}
      onChange={(e) => setIndustry(e.target.value)}
      required
    >
      <option>Select an industry</option>
      <option>Technology</option>
      <option>Healthcare</option>
      <option>Education</option>
      <option>Finance</option>
    </select>
  </fieldset>

  <fieldset className="border-2 rounded-md mb-4">
    <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
      Phone number:
    </legend>
   
     
      <input
        type="tel"
        pattern="[0-9]{10}"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
        placeholder="Enter phone number"
        required
      />

  </fieldset>

  <button
    type="submit"
    className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground3 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center mt-4"
  >
    Create Workspace
  </button>

  {/* <Link
    to="/overview"
    className="h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-white border rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold flex justify-center items-center mt-2"
  >
    Skip
  </Link> */}
</form>
          </div>
        </div>
      </div>
    </div>
  );
};



export const OnBoardingThree = () => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailRegex.test(email);
  };

  // Function to handle adding email to the list
  const addEmailToList = () => {
    if (!email) {
      setError("Email cannot be empty.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (emails.includes(email)) {
      setError("This email is already in the list.");
      return;
    }

    setEmails([...emails, email]);
    setEmail(""); // Clear the input field
    setError(""); // Clear any previous error
  };

  // Function to handle deleting an email from the list
  const deleteEmailFromList = (emailToDelete) => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };

  // Function to handle sending invitations
  const sendInvitations = async () => {
    setLoading(true); // Start loading
    setError("");
    setSuccess("");

    try {
      const workspaceId = 6; // Replace with your workspace ID
      const token = localStorage.getItem("access_token");

      const response = await api.post(
        `/workspaces/${workspaceId}/invitations/`,
        { emails: emails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Invitations sent successfully!");
      setEmails([]); // Clear the email list
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send invitations");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen font-poppins">
      <div className="w-[90%] max-w-[780px] h-auto md:h-[640px] bg-white flex flex-col rounded-2xl items-center justify-top relative px-6 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 gap-[24px] md:gap-[32px]">
        <img
          // src={mailCard}
          className="w-[96px] sm:w-[120px] md:w-[144px]"
          alt="Mail Card"
        />
        <h1 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold text-headerGray text-center">
          Invite members to workspace
        </h1>
        <form className="w-full font-semibold text-[16px] sm:text-[18px] flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px]">
          {/* Email Input Field */}
          <fieldset className="border-2 rounded-md mb-4">
            <legend className="text-sm ml-4 p-2 text-[12px] text-textPrimary">
              Enter emails:
            </legend>
            <div className="flex items-center gap-[8px] sm:gap-[12px] md:gap-[16px]">
              <input
                className="w-[97%] h-[31px] text-[16px] outline-none mb-2 ml-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Yourmail@gmail.com"
              />
              <button
                type="button"
                onClick={addEmailToList}
                className="flex items-center justify-center"
              >
                <img
                  src={add}
                  className="h-[16px] sm:h-[18px] md:h-[20px]"
                  alt="Add"
                />
              </button>
            </div>
            {/* Display error message if email is invalid */}
            {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
          </fieldset>

          {/* Display the email list */}
          {emails.length > 0 && (
            <div className="w-full">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border border-borderGray rounded-md mb-2"
                >
                  <span className="text-textPrimary">{email}</span>
                  <button
                    type="button"
                    onClick={() => deleteEmailFromList(email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-center w-full gap-4 sm:gap-5 md:gap-6">
            <Link to="/Onboarding-phase-three" className="w-full">
              <button className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground3 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center">
                Next
              </button>
            </Link>
            <button
              type="button"
              onClick={sendInvitations}
              disabled={loading || emails.length === 0} // Disable if loading or no emails
              className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground3 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center disabled:opacity-50"
            >
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </button>
            <Link
              to="/overview"
              className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-white border rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold flex justify-center items-center text-buttonBackground3"
            >
              Skip
            </Link>
          </div>

          {/* Success and Error Messages */}
          {success && (
            <p className="text-green-500 text-center mt-4">{success}</p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};



export const OnBoardingFour = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleNextClick = () => {
    setShowOverlay(true);

    // Set a timeout to hide the overlay and redirect after 5 seconds
    setTimeout(() => {
      setShowOverlay(false);
      navigate("/overview"); // Use navigate to redirect to /overview
    }, 5000); // 5000 milliseconds = 5 seconds
  };

  // Lottie options for the success animation
  const defaultOptions = {
    loop: true,
    autoplay: true, // Animation will play automatically
    animationData: SUCESS, // Path to the animation JSON file
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen px-4 bg-white sm:px-8 relative">
      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10">
        <img
          src={group}
          className="w-[80%] max-w-[300px] sm:max-w-[400px] md:max-w-[510px]"
          alt="Group illustration"
        />
        <h1 className="text-center text-[24px] sm:text-[32px] md:text-[48px] font-bold">
          You’re all set!
        </h1>
        <p className="text-center text-[14px] sm:text-[16px] md:text-[18px] text-headerGray2 font-medium">
          Explore Hirexer and make your first hire convenient
        </p>
        <button
          onClick={handleNextClick}
          className="w-full max-w-[197px] h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground2 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center"
        >
          Next
        </button>
      </div>
    </div>
  );
};