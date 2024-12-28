import triangles from "../images/resetPageImg/triangles.png";
import circles from "../images/resetPageImg/circles.png";
import success from "../images/resetPageImg/passwordSuccess.png";
import continueImage from "../images/resetPageImg/continueicon.png";
import { Link } from "react-router-dom";

export const PasswordResetSuccess = () => {
  return (
    <div className="bg-backgroundGreen w-screen h-screen font-['Poppins'] flex justify-center items-center relative">
      <img
        src={triangles}
        className="hidden sm:block w-[120px] md:w-[213px] h-auto absolute top-0 right-0"
        alt="Triangles"
      />
      <div className="w-[90%] max-w-[645px] h-auto bg-white rounded-2xl flex flex-col items-center justify-start relative p-4">
        <img
          src={success}
          className="w-[70%] max-w-[250px] h-auto mt-4 sm:mt-6"
          alt="Success"
        />
        <h1 className="font-semibold text-textPrimary text-[16px] sm:text-[24px] xl:text-[32px] text-center mt-4 sm:mt-6">
          You are all set <br />
          Your Password has been changed
        </h1>
        <Link
          to="/"
          className="mt-4 sm:mt-6 w-[140px] h-[40px] sm:w-[180px] sm:h-[50px] xl:w-[232px] xl:h-[56px] bg-buttonBackground hover:bg-buttonHover rounded-2xl text-[12px] sm:text-[16px] font-semibold text-white flex justify-center items-center gap-2"
        >
          Back to login
          <img
            src={continueImage}
            className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
            alt="Continue Icon"
          />
        </Link>
      </div>
      <img
        src={circles}
        className="hidden sm:block w-[120px] md:w-[213px] h-auto absolute bottom-0 left-0"
        alt="Circles"
      />
    </div>
  );
};
