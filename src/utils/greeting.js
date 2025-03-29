import { useState, useEffect } from "react";

const useGreeting = () => {
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return greeting;
};

export default useGreeting;