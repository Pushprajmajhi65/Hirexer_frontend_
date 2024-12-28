import { Route, Routes, useNavigate } from "react-router-dom";
import { SignUpPage } from "./components/SignUp";
import { LoginPage } from "./components/Login";
import { PasswordReset } from "./components/passwordReset";
import { NewPasswordSet } from "./components/NewPassword";
import { PasswordResetSuccess } from "./components/succesfulReset";
import {
  OnBoardingFour,
  OnBoardingOne,
  OnBoardingThree,
  OnBoardingTwo,
} from "./components/onboarding";
import { UserOverviewUI } from "./components/UserOverview";
import { MeetingUI } from "./components/meeting";
import { FeedUI } from "./components/feed";
import { Employee } from "./components/employee";
import { MyProfile } from "./components/profile";
import { LiveVideo } from "./components/liveVideo";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";

function App() {
  const navigate = useNavigate();
  const agoraClient = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
  );

  const handleConnect = (channelName) => {
    if (channelName) {
      navigate(`/via/${channelName}`);
    } else {
      console.error("Invalid channel name");
    }
  };

  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/set-password" element={<NewPasswordSet />} />
      <Route path="/passwordchanged" element={<PasswordResetSuccess />} />
      <Route path="/Sign-up" element={<SignUpPage />} />
      <Route path="/Onboarding" element={<OnBoardingOne />} />
      <Route path="/Onboarding-phase-one" element={<OnBoardingTwo />} />
      <Route path="/Onboarding-phase-two" element={<OnBoardingThree />} />
      <Route path="/Onboarding-phase-three" element={<OnBoardingFour />} />
      <Route path="/overview" element={<UserOverviewUI />} />
      <Route path="/feed" element={<FeedUI />} />
      <Route path="/employee" element={<Employee />} />
      <Route path="/profile" element={<MyProfile />} />

      {/* Agora RTC-related routes */}
      <Route
        path="/meeting"
        element={<MeetingUI connectToVideo={handleConnect} />}
      />
      <Route
        path="/via/:channelName"
        element={
          <AgoraRTCProvider client={agoraClient}>
            <LiveVideo />
          </AgoraRTCProvider>
        }
      />

      {/* Connect form route */}
      {/* <Route
        path="/connect"
        element={<ConnectForm connectToVideo={handleConnect} />}
      /> */}
    </Routes>
  );
}

export default App;
