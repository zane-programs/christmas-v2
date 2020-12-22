const Wemo = require("wemo-client");

/**
 * @callback changeCallback
 * @param  {*} value - Value of array element
 * @returns {void}
 */

/**
 * @callback initCallback
 * @returns {void}
 */

module.exports = class WemoAdapter {
  constructor(serialNumber) {
    this._client = null;
    this._changeListeners = [];
    this._wemo = new Wemo();
    this._serialNumber = serialNumber;
    this._previousState = null;

    this._startSubscriptionBackupLoop();
  }

  /**
   * Initializes Wemo adapter and then runs
   * callback function when done (cb)
   * @param {initCallback} cb callback function
   */
  init(cb) {
    console.log("init wemo");
    const self = this;
    this._wemo.discover(function discoverDevices(_err, deviceInfo) {
      console.log("Discovered device");
      if (deviceInfo.serialNumber === self._serialNumber) {
        console.log(
          `Discovered target device (serial number: ${deviceInfo.serialNumber})`
        );
        self._client = self._wemo.client(deviceInfo);
        self._client.on("binaryState", (value) => {
          console.log("** Change from subscription:");
          self._runChangeListeners(value);
        });
        cb(); // done!
      }
    });
  }

  /**
   * Gets current binaryState of plug (true or false)
   */
  getState() {
    // converts number binaryState value
    // to a boolean
    return new Promise((resolve, reject) => {
      if (this.clientReady) {
        this._client.getBinaryState((err, state) => {
          err ? reject(err) : resolve(Boolean(parseInt(state)));
        });
      } else {
        // reject(new Error("Client not ready yet, please wait"));
        resolve(false);
      }
    });
  }

  /**
   * Sets binaryState of plug (true or false)
   * @param {boolean} state binary state of the switch (true = on, false = off)
   */
  setState(state) {
    // takes a boolean value, converting
    // the boolean to a number
    return new Promise((resolve, reject) => {
      if (this.clientReady) {
        this._client.setBinaryState(Number(state), (err, _response) => {
          // just in case the subscription fails, send the state in 600 ms
          setTimeout(async () => {
            console.log("** Change from setState call:");
            this._runChangeListeners(await this.getState());
          }, 600);
          err ? reject(err) : resolve();
        });
      } else {
        // reject(new Error("Client not ready yet, please wait"));
        console.log("Client not ready yet, please wait to set state");
      }
    });
  }

  /**
   * Toggles state
   */
  async toggleState() {
    const state = await this.getState();
    await this.setState(!state);
  }

  /**
   * Adds change listener that runs when
   * the binary state changes
   * @param {changeCallback} listener
   */
  addChangeListener(listener) {
    this._changeListeners.push(listener);
  }

  /**
   * Checks whether or not the client is ready
   */
  get clientReady() {
    // deliberate use of abstract
    // equality comparison
    return this._client != null;
  }

  /**
   * Runs any attached change listeners
   * @param {string} value raw binaryState from client
   */
  _runChangeListeners(value) {
    // run all change listeners
    // when binary state changes
    const finalValue =
      typeof value === "boolean" ? value : Boolean(parseInt(value));
    console.log(`    Binary state changed to ${finalValue}`);
    for (const listener of this._changeListeners) {
      listener(finalValue);
    }
  }

  /**
   * Starts backup interval in case the
   * binaryState subscription fails.
   * Essentially, if the subscription fails,
   * this will manually check the state and
   * store it. If the state is altered, it
   * will run the change listeners with the
   * new state.
   */
  _startSubscriptionBackupLoop() {
    setInterval(async () => {
      // just in case the subscription fails
      let currentState = await this.getState();
      if (this._previousState != currentState) {
        console.log("** Change from backup interval:");
        this._runChangeListeners(currentState);
      }
      this._previousState = currentState;
    }, 1000);
  }
};
