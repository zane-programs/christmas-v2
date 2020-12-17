import { useContext, useCallback } from "react";

// context
import { SocketContext, StatusContext } from "../../App";
import StartStopButton from "../../components/StartStopButton";

export default function Home() {
  const { emitEvent, isConnected, isUpdatingStatus } = useContext(
    SocketContext
  );
  const status = useContext(StatusContext);

  const togglePlay = useCallback(
    // in true means that this is an event that
    // will result in a status change
    () => emitEvent(true, status.isPlaying ? "stop" : "play"),
    [emitEvent, status]
  );

  return isConnected ? (
    <StartStopButton
      onClick={togglePlay}
      isPlaying={status.isPlaying}
      disabled={isUpdatingStatus}
    />
  ) : (
    <div>Connecting...</div>
  );
}
