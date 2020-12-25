import { memo, ReactNode, useContext } from "react";
import { IconType } from "react-icons";

// context
import { ThemeContext } from "../../App";

// styles
import styles from "./BlockButton.module.css";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  IconComponent?: IconType;
}

function BlockButton({ children, IconComponent, ...props }: ButtonProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <button
      className={styles.button}
      style={{
        ...(props?.style || {}),
        backgroundColor: theme.mainColor,
      }}
      {...props}
    >
      {IconComponent ? <IconComponent className={styles.buttonIcon} /> : null}
      <span className={styles.buttonText}>{children}</span>
    </button>
  );
}

export default memo(BlockButton);
