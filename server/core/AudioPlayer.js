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

  /**
   * Plays an audio file using provided
   * path. If forcePlay is true, then it
   * will override the current audio
   * process and will play the given file
   * instead.
   * @param {string} filePath file path
   * @param {boolean} forcePlay whether or not player should override current audio
   */
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

  /**
   * Stops the current audio process
   */
  stop() {
    // kills audio process
    if (this._audioProcess && this._audioProcess.kill) {
      this._audioProcess.kill();
    }
  }

  /**
   * Returns player state
   */
  get isPlaying() {
    return this._isPlayingInternalState.currentState;
  }

  /**
   * Cleanup function of AudioPlayer
   * @param {boolean} shouldProcessExit whether or not process.exit should be called
   */
  _handleExit(shouldProcessExit = false) {
    this.stop();
    // Added this in because a few of the exit listeners
    // I had added (SIGUSR1, SIGUSR2, etc.) were causing
    // this process not to be able to stop.
    if (shouldProcessExit) process.exit(0);
  }

  /**
   * Runs status change event listener (if available).
   * Called when player state changes.
   */
  _triggerStatusChangeEvent() {
    if (this._options.onStatusChange) {
      this._options.onStatusChange(this.isPlaying);
    }
  }
};
