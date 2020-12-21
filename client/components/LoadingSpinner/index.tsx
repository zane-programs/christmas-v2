import { useMemo, memo } from "react";

// components
import ScreenReaderText from "../ScreenReaderText";

// styles
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  color: string;
  style?: React.CSSProperties;
  title?: string;
  thickness?: string; // pixels
  size?: string; // pixels
}

function LoadingSpinner(props: LoadingSpinnerProps) {
  const thickness = useMemo(() => props.thickness || "3px", [props.thickness]);
  const size = useMemo(() => props.size || "75px", [props.size]);
  const title = useMemo(() => props.title || "Loading...", [props.title]);

  return (
    <div
      className={styles.loadingSpinner}
      style={{
        ...props.style,
        width: size,
        height: size,
        borderTop: `${thickness} solid transparent`,
        borderBottom: `${thickness} solid ${props.color}`,
        borderLeft: `${thickness} solid ${props.color}`,
        borderRight: `${thickness} solid ${props.color}`,
      }}
      title={title}
    >
      <ScreenReaderText>{title}</ScreenReaderText>
    </div>
  );
}

export default memo(LoadingSpinner);
