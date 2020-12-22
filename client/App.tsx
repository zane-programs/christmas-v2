import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, Route, Routes, useLocation } from "react-router";
import io from "socket.io-client";

// theme
import defaultTheme, { Theme } from "./theme";

// components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

// hooks
import useWindowDimensions from "./hooks/useWindowDimensions";

/* TODO: use React.lazy for these and add a loading spinner */
// pages
import Home from "./pages/Home";
import Settings from "./pages/Settings";

export default function App() {
  const socket = useMemo(
    () => io(process.env.REACT_APP_API_HOST as string),
    []
  );

  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState({
    isPlaying: false,
    lightsOn: true, // set this way so that confetti does not
  } as ChristmasStatus);
  const [theme, setTheme] = useState(defaultTheme); // will probably add option to change it
  const [isUpdatingStatus, setUpdatingStatus] = useState(true);
  const [pageTitle, setPageTitle] = useState(null as PageTitle);

  const emitEvent = useCallback(
    (changesStatus: boolean, event: string, ...args: any[]) => {
      if (changesStatus) setUpdatingStatus(true);
      socket.emit(event, ...args);
    },
    [socket]
  );

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("status", (status: ChristmasStatus) => {
      setStatus(status);
      setUpdatingStatus(false);
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ emitEvent, isConnected, isUpdatingStatus }}
    >
      <StatusContext.Provider value={status}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <AppContext.Provider value={{ pageTitle, setPageTitle }}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </AppContext.Provider>
        </ThemeContext.Provider>
      </StatusContext.Provider>
    </SocketContext.Provider>
  );
}

function AppLayout() {
  const { theme } = useContext(ThemeContext);
  const { height } = useWindowDimensions();
  const { pathname } = useLocation();

  // set bg color of page as well
  useEffect(() => {
    document.body.style.backgroundColor = theme.backgroundColor;
  }, [theme.backgroundColor]);

  // scroll restoration on pathname change
  useEffect(() => {
    window.scrollTo(0, 0); // reset scroll position
  }, [pathname]);

  return (
    <>
      <TopBar />
      <main
        style={{
          backgroundColor: theme.backgroundColor,
          marginTop: `calc(env(safe-area-inset-top, 0px) + ${theme.topBarHeight})`,
          marginBottom: `calc(env(safe-area-inset-top, 0px) + ${theme.bottomNavHeight})`,
          minHeight: `calc(${height}px - ${theme.topBarHeight} - ${theme.bottomNavHeight} - (2 * ${theme.bodyPadding}))`,
          padding: theme.bodyPadding,
        }}
      >
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

// TODO: for organization purposes, move these contexts to different files (not App.tsx)
export const SocketContext = createContext({} as SocketContextInterface);
export const StatusContext = createContext({} as ChristmasStatus);
export const ThemeContext = createContext({} as ThemeContextInterface);
export const AppContext = createContext({} as AppContextInterface);

interface SocketContextInterface {
  // socket: SocketIOClient.Socket;
  emitEvent: (changesStatus: boolean, event: string, ...args: any[]) => void;
  isConnected: boolean;
  isUpdatingStatus: boolean;
}

interface ChristmasStatus {
  isPlaying: boolean;
  lightsOn: boolean;
}

interface ThemeContextInterface {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

type PageTitle = string | null;
interface AppContextInterface {
  pageTitle?: PageTitle;
  setPageTitle: React.Dispatch<React.SetStateAction<PageTitle>>;
}
