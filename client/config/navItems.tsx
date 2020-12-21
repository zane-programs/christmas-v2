import {
  IoHome,
  IoHomeOutline,
  IoSettings,
  IoSettingsOutline,
} from "react-icons/io5";
import { NavItemInterface } from "../components/BottomNav/NavItem";

const navItems: NavItemInterface[] = [
  {
    name: "Home",
    Icon: IoHomeOutline,
    ActiveIcon: IoHome,
    path: "/",
  },
  {
    name: "Settings",
    Icon: IoSettingsOutline,
    ActiveIcon: IoSettings,
    path: "/settings",
  },
];

export default navItems;
