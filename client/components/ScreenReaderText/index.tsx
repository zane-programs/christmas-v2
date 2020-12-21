import { memo } from "react";

import styles from "./ScreenReaderText.module.css";

interface ScreenReaderTextProps {
  children: React.ReactNode;
}

function ScreenReaderText({ children }: ScreenReaderTextProps) {
  return <span className={styles.srText}>{children}</span>;
}

// memoized for performance
export default memo(ScreenReaderText);
