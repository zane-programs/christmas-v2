import { memo } from "react";

interface ScreenReaderTextProps {
  children: React.ReactNode;
}

function ScreenReaderText({ children }: ScreenReaderTextProps) {
  return (
    <span
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        WebkitClipPath: "inset(50%)",
        clipPath: "inset(50%)",
        border: 0,
      }}
    >
      {children}
    </span>
  );
}

// memoized for performance
export default memo(ScreenReaderText);
