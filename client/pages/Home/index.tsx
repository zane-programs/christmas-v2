import { useContext, useCallback, useRef, useEffect, useMemo } from "react";
import Confetti, { ConfettiConfig } from "react-dom-confetti";
import { HiLightBulb, HiOutlineLightBulb } from "react-icons/hi";

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

  const confettiConfig: ConfettiConfig = useMemo(() => {
    return {
      angle: 90,
      spread: window.innerWidth,
      startVelocity: Math.round(85 * (window.innerWidth / 1100)),
      elementCount: Math.round(500 * (window.innerWidth / 1000)),
      dragFriction: 0.1,
      duration: 5500,
      stagger: 3,
      width: "12px",
      height: "12px",
      colors: theme.confettiColors,
    };
  }, [theme.confettiColors]);

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
      <Confetti active={status.lightsOn} config={confettiConfig} />
      <StartStopButton
        onClick={togglePlay}
        isPlaying={status.isPlaying}
        disabled={isUpdatingStatus}
        bgColor={theme.mainColor}
        ref={startStopButtonRef}
      />
      <button
        onClick={() => emitEvent(true, "toggleLight")}
        disabled={status.isPlaying || isUpdatingStatus}
      >
        {status.lightsOn ? <HiLightBulb /> : <HiOutlineLightBulb />}
        Turn Light {status.lightsOn ? "Off" : "On"}
      </button>
    </>
  ) : (
    <div>Connecting...</div>
  );
}
