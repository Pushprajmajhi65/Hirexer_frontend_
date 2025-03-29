import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Layout from "./components/shared/Layout";
import ScrollToTop from "./components/shared/ScrollToTop";
import Loader from "./components/shared/Loader";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { RoleProtectedRoute } from "./components/auth/RoleProtection";
const SuccessfulPasswordReset = lazy(() =>
  import("./pages/SuccessfulPasswordReset")
);
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const OTP = lazy(() => import("./pages/SignupOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
/* const NewPassword = lazy(() => import("./pages/NewPassword")); */
const ResetPasswordOTP = lazy(() => import("./pages/ResetPasswordOTP"));
const Overview = lazy(() => import("./pages/Overview"));
const WorkSpaceSetupDone = lazy(() => import("./pages/WorkspaceSetupdone"));
const CreateWorkspace = lazy(() => import("./pages/CreateWorkspace"));
const OnBoarding = lazy(() => import("./pages/OnBoarding"));
const WorkspaceInvitation = lazy(() => import("./pages/WorkspaceInvitation"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const Applications = lazy(() => import("./pages/Applications"));
const Profile = lazy(() => import("./pages/Profile"));
const Employee = lazy(() => import("./pages/Employee"));
const Meeting = lazy(() => import("./pages/Meeting"));
const Feed = lazy(() => import("./pages/Feed"));
const RTC = lazy(() => import("./pages/RTC"));
const AppliedJobs = lazy(() => import("./pages/AppliedJobs"));

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 1000,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Suspense fallback={<Loader />}>
            <BrowserRouter>
              <ScrollToTop />
              <Toaster
                position="top-right"
                gutter={12}
                containerStyle={{ margin: "8px" }}
                toastOptions={{
                  success: { duration: 5000 },
                  error: { duration: 5000 },
                  style: {
                    fontSize: "16px",
                    maxWidth: "500px",
                    padding: "16px 24px",
                  },
                }}
              />
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/otp"
                  element={
                    <PublicRoute>
                      <OTP />
                    </PublicRoute>
                  }
                />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route
                  path="/resetpasswordotp/:email"
                  element={<ResetPasswordOTP />}
                />
                <Route
                  path="/successfulreset"
                  element={<SuccessfulPasswordReset />}
                />

                {/* Protected Routes (require authentication) */}
                <Route
                  path="/createworkspace"
                  element={
                    <ProtectedRoute>
                      <CreateWorkspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnBoarding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workspacesetupdone"
                  element={
                    <ProtectedRoute>
                      <WorkSpaceSetupDone />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workspaceinvite/:id"
                  element={
                    <ProtectedRoute>
                      <WorkspaceInvitation />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Layout Routes with Role-based Access */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Overview />} />
                  <Route path="/overview" element={<Overview />} />
                  
                  {/* Head Member Only Routes */}
                  <Route
                    path="/applications"
                    element={
                      <RoleProtectedRoute allowedRoles={['headmember']}>
                        <Applications />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee"
                    element={
                      <RoleProtectedRoute allowedRoles={['headmember']}>
                        <Employee />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* Normal Member Only Routes */}
                  <Route
                    path="/myapplications/:id"
                    element={
                      <RoleProtectedRoute allowedRoles={['member']}>
                        <MyApplications />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="/applied-jobs"
                    element={
                      <RoleProtectedRoute allowedRoles={['member']}>
                        <AppliedJobs />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* Routes Accessible to All Authenticated Users */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/meetings" element={<Meeting />} />
                  <Route path="/feed" element={<Feed />} />
                </Route>

                {/* Other Routes */}
                <Route path="*" element={<PageNotFound />} />
                <Route path="/live-video" element={<RTC />} />
              </Routes>
            </BrowserRouter>
          </Suspense>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
