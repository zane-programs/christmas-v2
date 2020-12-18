import { useContext, useCallback, useRef, useEffect } from "react";
import Confetti from "react-dom-confetti";

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
      isFirstRender.current = false;
      return;
    }
    // focus otherwise
    if (!isUpdatingStatus && !isFirstRender.current)
      startStopButtonRef.current?.focus();
  }, [isUpdatingStatus]);

  return isConnected ? (
    <>
      <Confetti
        active={status.lightsOn}
        config={{
          angle: 90,
          spread: 400,
          startVelocity: 45,
          elementCount: 100,
          dragFriction: 0.12,
          duration: 4500,
          stagger: 3,
          width: "10px",
          height: "10px",
          colors: theme.confettiColors,
        }}
      />
      <StartStopButton
        onClick={togglePlay}
        isPlaying={status.isPlaying}
        disabled={isUpdatingStatus}
        bgColor={theme.mainColor}
        ref={startStopButtonRef}
      />
    </>
  ) : (
    <div>Connecting...</div>
  );
}
