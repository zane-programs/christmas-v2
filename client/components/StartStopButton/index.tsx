import { forwardRef, useMemo } from "react";

// hooks
import useWindowDimensions from "../../hooks/useWindowDimensions";

// components
import ScreenReaderText from "../ScreenReaderText";

// styles
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
  const { width } = useWindowDimensions();

  // button size
  const buttonSize = useMemo(() => Math.min(0.8 * width, 300), [width]);

  // button styling
  const buttonStyle: React.CSSProperties = useMemo(() => {
    return {
      ...(style || {}),
      backgroundColor: bgColor || "#ff0000",
      width: buttonSize,
      height: buttonSize,
    };
  }, [bgColor, style, buttonSize]);

  // text for accessibility
  const hiddenButtonText = useMemo(() => (isPlaying ? "Stop" : "Play"), [
    isPlaying,
  ]);

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
