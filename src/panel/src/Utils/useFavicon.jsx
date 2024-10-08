import { useEffect } from "react";

const useFavicon = () => {
  useEffect(() => {
    const setFavicon = (iconPath) => {
      const favicon = document.getElementById("favicon");
      if (favicon) {
        favicon.href = iconPath;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFavicon("favicon-off.svg");
      } else {
        setFavicon("favicon.svg");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useFavicon;
