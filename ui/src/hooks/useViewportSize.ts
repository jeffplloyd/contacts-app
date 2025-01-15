import { useState, useEffect } from "react";

const useViewportSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<"sm" | "md" | "lg">();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSmallScreen("sm");
      } else if (window.innerWidth < 1200) {
        setIsSmallScreen("md");
      } else {
        setIsSmallScreen("lg");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isSmallScreen;
};

export default useViewportSize;
