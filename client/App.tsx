import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, Route, Routes } from "react-router";
import io from "socket.io-client";

// theme
import defaultTheme from "./theme";

/* TODO: use React.lazy for these and add a loading spinner */
// pages
import Home from "./pages/Home";

export default function App() {
  const socket = useMemo(
    () => io(process.env.REACT_APP_API_HOST as string),
    []
  );

  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState({ isPlaying: false } as ChristmasStatus);
  const [theme, setTheme] = useState(defaultTheme); // will probably add option to change it

  const [isUpdatingStatus, setUpdatingStatus] = useState(true);

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
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </ThemeContext.Provider>
      </StatusContext.Provider>
    </SocketContext.Provider>
  );
}

export const SocketContext = createContext({} as SocketContextInterface);
export const StatusContext = createContext({} as ChristmasStatus);
// created context just in case I ever want to change theme dynamically
export const ThemeContext = createContext({} as ThemeContextInterface);

function AppLayout() {
  // TODO: Make this a real app layout+
  const status = useContext(StatusContext);
  const { isConnected, isUpdatingStatus } = useContext(SocketContext);
  return (
    <>
      <p>Playing: {JSON.stringify(status.isPlaying)}</p>
      <p>Is Connected: {JSON.stringify(isConnected)}</p>
      <p>Is Updating Status: {JSON.stringify(isUpdatingStatus)}</p>
      <Outlet />
    </>
  );
}

interface SocketContextInterface {
  // socket: SocketIOClient.Socket;
  emitEvent: (changesStatus: boolean, event: string, ...args: any[]) => void;
  isConnected: boolean;
  isUpdatingStatus: boolean;
}

interface ChristmasStatus {
  isPlaying: false;
}

export interface Theme {
  mainColor: string;
}

interface ThemeContextInterface {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}
