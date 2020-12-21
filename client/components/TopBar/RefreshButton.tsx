import { memo, useCallback, useState } from "react";
import { IoRefresh } from "react-icons/io5";
import ScreenReaderText from "../ScreenReaderText";

// styles
import styles from "./TopBar.module.css";

function RefreshButton() {
  const [active, setActiveState] = useState(false);

  const reloadPage = useCallback(() => {
    if (!active) {
      setActiveState(true);
      setTimeout(() => window.location.reload(), 400);
    }
  }, [active]);

  return (
    <button
      className={styles.refreshButton + (active ? " " + styles.active : "")}
      onClick={reloadPage}
      aria-label="Refresh"
      title="Refresh"
    >
      <IoRefresh className={styles.refreshButtonIcon} />
      <ScreenReaderText>Refresh</ScreenReaderText>
    </button>
  );
}

export default memo(RefreshButton);
