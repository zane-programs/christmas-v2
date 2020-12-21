import { memo, useMemo } from "react";
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";

// components
import ScreenReaderText from "../ScreenReaderText";

// styles
import styles from "./BottomNav.module.css";

export interface NavItemInterface {
  name: string; // name
  Icon: IconType; // icon element
  path: string; // url path
  ActiveIcon?: IconType; // optional: icon for active
}

function NavItem({ name, Icon, ActiveIcon, path }: NavItemInterface) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // whether or not the nav item's path is currently in view
  const isActive = useMemo(() => pathname === path, [pathname, path]);

  // props for displayed icon
  const iconProps: React.SVGAttributes<SVGElement> = useMemo(() => {
    return {
      className: styles.navItemIcon,
    };
  }, []);

  return (
    <button
      className={styles.navItem + (isActive ? " " + styles.activeItem : "")}
      onClick={() => navigate(path)}
      title={name}
      aria-label={name}
      tabIndex={0}
    >
      {isActive && ActiveIcon ? (
        <ActiveIcon {...iconProps} />
      ) : (
        <Icon {...iconProps} />
      )}
      <ScreenReaderText>{name}</ScreenReaderText>
    </button>
  );
}

export default memo(NavItem);
