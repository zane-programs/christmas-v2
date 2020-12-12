import { createContext, useMemo } from "react";
import { Outlet, Route, Routes } from "react-router";
import io from "socket.io-client";

/* TODO: use React.lazy for these and add a loading spinner */
// pages
import Home from "./pages/Home";

export default function App() {
  const socket = useMemo(
    () => io(process.env.REACT_APP_API_HOST as string),
    []
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </SocketContext.Provider>
  );
}

export const SocketContext = createContext({
  socket: {} as SocketIOClient.Socket,
});

function AppLayout() {
  // TODO: Make this a real app layout
  return <Outlet />;
}
