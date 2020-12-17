const State = require("./State");

module.exports = class AudioPlayer {
  constructor(options = {}) {
    this._options = options;
    this._isPlayingInternalState = new State(false);
    this._isPlayingInternalState.addChangeListener(
      this._triggerStatusChangeEvent.bind(this)
    );

    // init inner audio player
    this._player = require("play-sound")(options.playerOpts || {});

    // catches process exit
    process.on("exit", () => this._handleExit());

    // catches ctrl+c event
    process.on("SIGINT", () => this._handleExit(true));

    // catches "kill pid" (e.g. nodemon restart)
    process.on("SIGUSR1", () => this._handleExit(true));
    process.on("SIGUSR2", () => this._handleExit(true));

    // catches uncaught exceptions
    process.on("uncaughtException", () => this._handleExit());
  }

  playAudio(filePath, forcePlay = false) {
    return new Promise((resolve, reject) => {
      if (this.isPlaying && !forcePlay) {
        // if audio is playing and we have not
        // requested it to force current audio
        // to stop playing, reject w/ error:
        reject(new Error("Audio is still playing"));
      } else {
        this._isPlayingInternalState.setState(true); // set playing state to true
        this.stop(); // stop any audio that might be playing
        this._audioProcess = this._player.play(filePath, (error) => {
          // handle response (reject if error, resolve if okay)
          this._isPlayingInternalState.setState(false); // no longer playing, so adjust state accordingly
          error
            ? reject(new Error(`Audio stopped early (code ${error})`))
            : resolve();
        });
      }
    });
  }

  stop() {
    // kills audio process
    if (this._audioProcess && this._audioProcess.kill) {
      // this._audioProcess.stdin.pause();
      this._audioProcess.kill();
    }
  }

  get isPlaying() {
    // if (!this._audioProcess && !this._isPlayingInternalState.currentState)
    //   return false;
    // return (
    //   this._isPlayingInternalState.currentState || !this._audioProcess.killed
    // );
    // ------------
    // if (!this._audioProcess) return false;
    // if (this._audioProcess.killed) return false;
    return this._isPlayingInternalState.currentState;
  }

  _handleExit(shouldProcessExit = false) {
    this.stop();
    // Added this in because a few of the exit listeners
    // I had added (SIGUSR1, SIGUSR2, etc.) were causing
    // this process not to be able to stop.
    if (shouldProcessExit) process.exit(0);
  }

  _triggerStatusChangeEvent() {
    if (this._options.onStatusChange) {
      this._options.onStatusChange(this.isPlaying);
    }
  }
};
