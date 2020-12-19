const Wemo = require("wemo-client");

module.exports = class WemoAdapter {
  constructor(serialNumber) {
    this._client = null;
    this._changeListeners = [];
    this._wemo = new Wemo();
    this._serialNumber = serialNumber;
    this._previousState = null;

    // workaround part 2
    setInterval(async () => {
      // just in case the subscription fails
      let currentState = await this.getState();
      if (this._previousState != currentState) {
        this._runChangeListeners(currentState);
      }
      this._previousState = currentState;
    }, 1000);
  }

  init(cb) {
    console.log("init wemo");
    const self = this;
    this._wemo.discover(function discoverDevices(_err, deviceInfo) {
      console.log("found one");
      if (deviceInfo.serialNumber === self._serialNumber) {
        console.log("found THE one");
        self._client = self._wemo.client(deviceInfo);
        self._client.on("binaryState", (value) => {
          console.log(`FROM SUBSCRIPTION - Binary state changed to ${value}`);
          self._runChangeListeners(value);
        });
        cb(); // done!
      }
    });
  }

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

  setState(state) {
    // takes a boolean value, converting
    // the boolean to a number
    return new Promise((resolve, reject) => {
      if (this.clientReady) {
        this._client.setBinaryState(Number(state), (err, _response) => {
          // just in case the subscription fails, send the state in 600 ms
          setTimeout(() => this._runChangeListeners(this.getState()), 600);
          err ? reject(err) : resolve();
        });
      } else {
        // reject(new Error("Client not ready yet, please wait"));
        console.log("Client not ready yet, please wait to set state");
      }
    });
  }

  async toggleState() {
    const state = await this.getState();
    await this.setState(!state);
  }

  addChangeListener(listener) {
    this._changeListeners.push(listener);
  }

  get clientReady() {
    // deliberate use of abstract
    // equality comparison
    return this._client != null;
  }

  _runChangeListeners(value) {
    // run all change listeners
    // when binary state changes
    for (const listener of this._changeListeners) {
      listener(Boolean(parseInt(value)));
      console.log("Listener fired");
    }
  }
};
