import React from "react";
import authImage from "../../assets/login.png";

const AuthImageDialog = () => {
  return (
    <div>
      <img src={authImage} alt="auth image" className="hidden md:block" />
    </div>
  );
};

export default AuthImageDialog;
