import { memo } from "react";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

function Button(props: ButtonProps) {
  return <button {...props}></button>;
}

export default memo(Button);
