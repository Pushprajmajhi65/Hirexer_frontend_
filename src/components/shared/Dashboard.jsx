import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { DashBoardMenuItems } from "@/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";

const Dashboard = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const { selectedWorkspace } = useWorkspace();
  const userRole = selectedWorkspace?.user_role;

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (!selectedWorkspace) return DashBoardMenuItems;

    if (userRole === 'headmember') {
      // Remove "Applied Jobs" for head member
      return DashBoardMenuItems.filter(item => 
        item.name.toLowerCase() !== 'applied jobs'
      );
    } else {
      // Remove "Employee" and "Applications" for normal members
      return DashBoardMenuItems.filter(item => 
        !['employee', 'applications'].includes(item.name.toLowerCase())
      );
    }
  }, [selectedWorkspace, userRole]);

  return (
    <>
      <aside
        className={`
          ${isExpanded ? "lg:w-64 w-16" : "w-16"} 
          h-full py-6 px-3 fixed z-40
          transition-all duration-300 ease-in-out
          bg-white border-r rounded-r-2xl
        `}
      >
        <div
          className={`
            flex justify-center
            ${isExpanded ? "lg:px-3 px-0" : "px-0"}
            ${(!isExpanded || window.innerWidth < 1024) && "scale-75"}
            transition-all duration-300
          `}
        >
          <Logo />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-12 bg-white border rounded-full p-1.5 
            hover:bg-gray-50 transition-colors shadow-sm hidden lg:block"
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <nav className="mt-8 space-y-1">
          {menuItems.map((item, index) => {
            const itemPath = item.name.toLowerCase().replace(/\s+/g, "-");
            const isActive =
              (itemPath === "overview" && location.pathname === "/") ||
              location.pathname === `/${itemPath}`;

            return (
              <Link
                key={index}
                to={itemPath === "overview" ? "/" : `/${itemPath}`}
                className={`
                  group flex items-center relative
                  ${
                    isExpanded
                      ? "lg:px-4 px-2 lg:justify-start justify-center"
                      : "px-2 justify-center"
                  } 
                  py-2.5 rounded-r-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-figmaBackground text-primary/80 font-medium"
                      : "text-primary/70 hover:bg-gray-50 hover:text-primary/90"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-figmaPrimary rounded-l-lg" />
                )}

                <span
                  className={`
                    ${!isExpanded && "scale-110"} 
                    transition-transform relative
                  `}
                >
                  {item.icon}

                  <span
                    className={`
                      absolute left-full ml-2 bg-gray-900 text-white text-sm
                      px-2 py-1 rounded whitespace-nowrap opacity-0 invisible
                      group-hover:opacity-100 group-hover:visible
                      transition-all duration-200
                      lg:hidden
                      ${isExpanded ? "hidden" : "block"}
                      z-50
                    `}
                    style={{ transform: "translateY(-50%)", top: "50%" }}
                  >
                    {item.name}
                  </span>
                </span>

                {isExpanded && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap hidden lg:block">
                    {item.name}
                </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div
        className={`
          ${isExpanded ? "lg:w-64 w-16" : "w-16"}
          flex-shrink-0 transition-all duration-300 ease-in-out
        `}
      />
    </>
  );
};

export default Dashboard;