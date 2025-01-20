import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function BackgroundManager() {
  const location = useLocation();

  useEffect(() => {
    const body = document.body;
    switch (location.pathname) {
      case "/teacher-requests":
        body.style.background = "linear-gradient(135deg, #2c5364, #0f2027)";
        break;
      case "/profile":
        body.style.background = "linear-gradient(to bottom, #6dd5ed, #2196f3)";
        break;
      case "/request":
        body.style.background = "linear-gradient(to bottom, #56ccf2, #2f80ed)";
        break;
      case "/login":
        body.style.background =
          "linear-gradient(to bottom right,hsl(214, 82%, 51%),hsl(122, 39%, 49%))";
        break;
      case "/register":
        body.style.background =
          "linear-gradient(to bottom right,hsl(214, 82%, 51%),hsl(122, 39%, 49%))";
        break;
      default:
        body.style.background = "rgb(65, 64, 64)";
        break;
    }

    return () => {
      body.style.background = "rgb(65, 64, 64)";
    };
  }, [location.pathname]);
  return null;
}
