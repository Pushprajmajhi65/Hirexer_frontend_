import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Header from "./Header";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  const bgClass =
    location.pathname === "/applications" || "/applied jobs"
      ? "bg-applicationBg"
      : "bg-figmaGray";

  return (
    <div className="flex min-h-screen relative">
      <Dashboard />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header />
        <main className={cn("flex-1 py-6 pl-2 xl:pl-8 pr-2 xl:pr-16", bgClass)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
