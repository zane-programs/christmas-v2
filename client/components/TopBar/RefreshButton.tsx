import { memo, useCallback, useState } from "react";
import { IoRefresh } from "react-icons/io5";

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
    >
      <IoRefresh className={styles.refreshButtonIcon} />
    </button>
  );
}

export default memo(RefreshButton);
