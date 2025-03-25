import React from "react";

const Loader = () => {
  return (
   <div className="flex items-center justify-center h-screen">
     <div className="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
   </div>
  );
};

export default Loader;
