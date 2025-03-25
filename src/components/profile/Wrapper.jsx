import React from "react";

const Wrapper = ({ children }) => {
  return <div className="flex flex-col space-y-2 md:flex-row md:gap-40 xl:gap-64">{children}</div>;
};

export default Wrapper;
