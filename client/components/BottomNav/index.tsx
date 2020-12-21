import { memo, useContext } from "react";

// nav components & config
import NavItem from "./NavItem";
import navItems from "../../config/navItems";

// context
import { ThemeContext } from "../../App";

// styles
import styles from "./BottomNav.module.css";

function BottomNav() {
  const { theme } = useContext(ThemeContext);

  return (
    <nav
      className={styles.bottomNav}
      style={{
        backgroundColor: theme.mainColor,
        height: `calc(env(safe-area-inset-top, 0px) + ${theme.bottomNavHeight})`,
      }}
    >
      {/* <ul> */}
      {navItems.map((props) => (
        <NavItem {...props} key={props.path} />
      ))}
      {/* </ul> */}
    </nav>
  );
}

export default memo(BottomNav);
