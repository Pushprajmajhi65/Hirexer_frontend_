import { useState, useEffect } from 'react';

const usePasswordStrength = (password) => {
  const [strength, setStrength] = useState(0);

  const calculateStrength = (password) => {
    let strengthScore = 0;

    if (!password) return 0;

    // Check length
    if (password.length >= 8) strengthScore += 1;

    // Check for numbers and letters
    if (/\d/.test(password) && /[a-zA-Z]/.test(password)) strengthScore += 1;

    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strengthScore += 1;

    // Check for uppercase and lowercase
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strengthScore += 1;

    return strengthScore;
  };

  const getStrengthText = () => {
    switch (strength) {
      case 0:
        return 'Weak';
      case 1:
        return 'Fair';
      case 2:
        return 'Good';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = (index) => {
    if (index >= strength) return 'bg-gray-200';
    
    switch (strength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  useEffect(() => {
    const newStrength = calculateStrength(password);
    setStrength(newStrength);
  }, [password]);

  return {
    strength,
    getStrengthText,
    getStrengthColor,
  };
};

export default usePasswordStrength;