import { CSSProperties, memo, useContext, useMemo } from "react";

// context
import { AppContext, ThemeContext } from "../../App";

// hooks
import useScrollPosition from "../../hooks/useScrollPosition";
import RefreshButton from "./RefreshButton";

// styles
import styles from "./TopBar.module.css";

function TopBar() {
  const { pageTitle } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);
  const scrollPosition = useScrollPosition();

  const topBarClassName = useMemo(
    () =>
      scrollPosition > 10
        ? `${styles.topBar} ${styles.scrolled}`
        : styles.topBar,
    [scrollPosition]
  );

  const topBarStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: theme.mainColor,
      height: `calc(env(safe-area-inset-top, 0px) + ${theme.topBarHeight})`,
    };
  }, [theme]);

  return (
    <div className={topBarClassName} style={topBarStyle}>
      <h1
        className={styles.pageTitle}
        style={{
          lineHeight: theme.topBarHeight,
          fontSize: theme.topBarFontSize,
        }}
      >
        {pageTitle || "Christmas"}
      </h1>
      <RefreshButton/>
    </div>
  );
}

export default memo(TopBar);
