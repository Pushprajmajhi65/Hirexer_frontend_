import React from "react";

const Wrapper = ({ children }) => {
  return <div className="flex flex-col md:flex-row  md:items-center gap-1 md:gap-5">{children}</div>;
};

export default Wrapper;
