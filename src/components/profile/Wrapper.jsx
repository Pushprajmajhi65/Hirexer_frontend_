import React from "react";

const Wrapper = ({ children }) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0">
      {children}
    </div>
  );
};

export default Wrapper;