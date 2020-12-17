import { useMemo } from "react";
import styles from "./StartStopButton.module.css";

interface StartStopButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isPlaying: boolean;
  bgColor?: string;
}

export default function StartStopButton({
  isPlaying,
  style,
  bgColor,
  ...props // other props
}: StartStopButtonProps) {
  // button styling
  const buttonStyle: React.CSSProperties = useMemo(() => {
    return { ...(style || {}), backgroundColor: bgColor || "#ff0000" };
  }, [bgColor, style]);

  return (
    <button
      className={styles.button}
      aria-label={isPlaying ? "Stop" : "Play"}
      style={buttonStyle}
      {...props}
    >
      <div
        className={
          styles.icon + " " + (isPlaying ? styles.square : styles.triangle)
        }
      ></div>
    </button>
  );
}
