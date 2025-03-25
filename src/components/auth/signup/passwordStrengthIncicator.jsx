import React from "react";
import usePasswordStrength from "@/utils/passwordStrength";

const PasswordStrengthIndicator = ({ password }) => {
  const { strength, getStrengthColor } = usePasswordStrength(password);

  const getTextColor = () => {
    switch (strength) {
      case 0:
        return "text-red-500";
      case 1:
        return "text-orange-500";
      case 2:
        return "text-yellow-500";
      case 3:
        return "text-yellow-600";
      case 4:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-2">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(
              index
            )}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
