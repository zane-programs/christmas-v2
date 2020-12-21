import { forwardRef, useMemo } from "react";
import ScreenReaderText from "../ScreenReaderText";
import styles from "./StartStopButton.module.css";

interface StartStopButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isPlaying: boolean;
  bgColor?: string;
}

const StartStopButton = forwardRef(function StartStopButton(
  {
    isPlaying,
    style,
    bgColor,
    ...props // other props
  }: StartStopButtonProps,
  ref
) {
  // button styling
  const buttonStyle: React.CSSProperties = useMemo(() => {
    return { ...(style || {}), backgroundColor: bgColor || "#ff0000" };
  }, [bgColor, style]);

  //
  const hiddenButtonText = useMemo(() => isPlaying ? "Stop" : "Play", [isPlaying]);

  return (
    <button
      className={styles.button}
      aria-label={hiddenButtonText}
      style={buttonStyle}
      {...props}
      ref={ref as React.RefObject<HTMLButtonElement> | null | undefined}
    >
      <div
        className={
          styles.icon + " " + (isPlaying ? styles.square : styles.triangle)
        }
      >
        <ScreenReaderText>{hiddenButtonText}</ScreenReaderText>
      </div>
    </button>
  );
});

export default StartStopButton;
