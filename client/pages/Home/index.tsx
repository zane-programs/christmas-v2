import { useContext, useCallback, useRef, useEffect } from "react";

// context
import { SocketContext, StatusContext, ThemeContext } from "../../App";

// components
import StartStopButton from "../../components/StartStopButton";

export default function Home() {
  const { emitEvent, isConnected, isUpdatingStatus } = useContext(
    SocketContext
  );
  const status = useContext(StatusContext);
  const { theme } = useContext(ThemeContext);

  const startStopButtonRef:
    | React.RefObject<HTMLButtonElement>
    | null
    | undefined = useRef(null); // will hold button reference
  const isFirstRender = useRef(true); // whether or not this is the first render

  const togglePlay = useCallback(
    // in true means that this is an event that
    // will result in a status change
    () => emitEvent(true, status.isPlaying ? "stop" : "play"),
    [emitEvent, status]
  );

  // focus button on status change (because
  // it disables while waiting for server)
  useEffect(() => {
    // stop on first page render
    if (isFirstRender.current) {
      console.log("first");
      isFirstRender.current = false;
      return;
    }
    // focus otherwise
    if (!isUpdatingStatus && !isFirstRender.current)
      startStopButtonRef.current?.focus();
  }, [isUpdatingStatus]);

  return isConnected ? (
    <StartStopButton
      onClick={togglePlay}
      isPlaying={status.isPlaying}
      disabled={isUpdatingStatus}
      bgColor={theme.mainColor}
      ref={startStopButtonRef}
    />
  ) : (
    <div>Connecting...</div>
  );
}
