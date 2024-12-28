import continueImage from "../images/onBoarding/continueBlack.png";
import welcome from "../images/onBoarding/Welcome.png";
import mailCard from "../images/onBoarding/mailCard.png";
import add from "../images/onBoarding/add.png";
import group from "../images/onBoarding/groupimg.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
              src={mailCard}
              className="w-20 sm:w-24 md:w-28 lg:w-32"
              alt="Mail Card"
            />
            <h1 className="text-center text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-semibold mt-4">
              Let's Start with your
              <br /> Onboarding
            </h1>
            <form
              className="flex flex-col w-full mt-6"
              onSubmit={createWorkspace}
            >
              <fieldset className="flex flex-col mb-4">
                <label className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold mb-1">
                  Workspace Name
                </label>
                <input
                  className="w-full h-[36px] sm:h-[44px] md:h-[46px] lg:h-[48px] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] outline-none border rounded-xl px-3"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g., John’s Bakery"
                  required
                />
              </fieldset>

              <fieldset className="flex flex-col mb-4">
                <label className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold mb-1">
                  Email
                </label>
                <input
                  className="w-full h-[36px] sm:h-[44px] md:h-[46px] lg:h-[48px] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] outline-none border rounded-xl px-3"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Yourmail@gmail.com"
                  required
                />
              </fieldset>

              <fieldset className="flex flex-col mb-4">
                <label className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold mb-1">
                  Country
                </label>
                <input
                  className="w-full h-[36px] sm:h-[44px] md:h-[46px] lg:h-[48px] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] outline-none border rounded-xl px-3"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Nepal"
                  required
                />
              </fieldset>

              <fieldset className="flex flex-col mb-4">
                <label className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold mb-1">
                  Industry
                </label>
                <select
                  className="w-full h-[36px] sm:h-[44px] md:h-[46px] lg:h-[48px] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] outline-none border rounded-xl px-3"
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

              <fieldset className="flex flex-col mb-4">
                <label className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold mb-1">
                  Phone number
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    id="country-code"
                    className="w-fit px-3 py-2 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] border rounded-xl"
                    required
                  >
                    <option>+977</option>
                  </select>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] border rounded-xl"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </fieldset>

              <button
                type="summit"
                className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground3 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center mt-4"
              >
                Create Workspace
              </button>

              <Link
                to="/overview"
                className="h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-white border rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold flex justify-center items-center mt-2"
              >
                Skip
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OnBoardingThree = () => {
  // States to handle email input and email list
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);

  // Function to handle adding email to the list
  const addEmailToList = () => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmail(""); // Clear the input field
    }
  };

  // Function to handle deleting an email from the list
  const deleteEmailFromList = (emailToDelete) => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };

  // Function to handle sending invitations
  const sendInvitations = async () => {
    try {
      const workspaceId = 6;
      const token = localStorage.getItem("access_token");

      const response = await api.post(
        `/workspaces/${workspaceId}/invitations/`,
        { emails: emails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Handle success response (optional)
      etSuccess("Registration successful");
      setError("");
      setEmails([]);
    } catch (err) {
      // Handle errors from the API
      setError(err.response?.data?.error || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen font-poppins">
      <div className="w-[90%] max-w-[780px] h-auto md:h-[640px] bg-white flex flex-col rounded-2xl items-center justify-top relative px-6 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 gap-[24px] md:gap-[32px]">
        <img src={mailCard} className="w-[96px] sm:w-[120px] md:w-[144px]" />
        <h1 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold text-headerGray text-center">
          Invite members to workspace
        </h1>
        <form className="w-full font-semibold text-[16px] sm:text-[18px] flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px]">
          <fieldset>
            <label className="text-headerGray2">Enter emails</label>
            <div className="flex items-center gap-[8px] sm:gap-[12px] md:gap-[16px]">
              <input
                className="w-full h-[36px] sm:h-[44px] md:h-[46px] lg:h-[48px] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] outline-none border rounded-xl px-3"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Yourmail@gmail.com"
              />
              <button type="button" onClick={addEmailToList}>
                <img
                  src={add}
                  className="h-[16px] sm:h-[18px] md:h-[20px]"
                  alt="Add"
                />
              </button>
            </div>
          </fieldset>

          {/* Display the email list */}
          {emails.length > 0 && (
            <div className="mt-4 border border-borderGray rounded-3xl w-[132px] flex items-center py-2 px-4 gap-2">
              <div className="w-[26px] h-[26px] border-borderGray border rounded-full "></div>
              <p className="mt-2 text-headerGray text-[10px] h-full text-center">
                {emails.join(", ")}
              </p>{" "}
              {/* Join emails with comma and display in <p> */}
            </div>
          )}

          <div className="flex items-center justify-center w-full gap-4 sm:gap-5 md:gap-6">
            <Link to="/Onboarding-phase-three" className="w-full">
              <button className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground3 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center">
                Next
              </button>
            </Link>
            <button
              type="button"
              onClick={sendInvitations}
              className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground3 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center"
            >
              Send Invitation
            </button>
            <Link
              to="/overview"
              className="w-full h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-white border rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold flex justify-center items-center text-buttonBackground3"
            >
              Skip
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export const OnBoardingFour = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen px-4 bg-white sm:px-8">
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
        <Link
          to="/overview"
          className="w-full max-w-[197px] h-[40px] sm:h-[44px] md:h-[46px] lg:h-[48px] bg-buttonBackground2 rounded-2xl text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-white flex justify-center items-center"
        >
          Next
        </Link>
      </div>
    </div>
  );
};
