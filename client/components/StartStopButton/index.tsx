import styles from "./StartStopButton.module.css";

interface StartStopButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isPlaying: boolean;
}

export default function StartStopButton({
  isPlaying,
  ...props // other props
}: StartStopButtonProps) {
  return (
    <button
      className={styles.button}
      aria-label={isPlaying ? "Stop" : "Play"}
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
