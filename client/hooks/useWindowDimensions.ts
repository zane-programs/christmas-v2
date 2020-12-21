import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const callback = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", callback);

    // on unmount
    return () => {
      window.removeEventListener("resize", callback);
    };
  }, []);

  return { width, height };
}
