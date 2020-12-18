const Wemo = require("wemo-client");

module.exports = class WemoAdapter {
  constructor(serialNumber) {
    this._client = null;
    this._changeListeners = [];
    this._wemo = new Wemo();

    const self = this;
    this._wemo.discover(function discoverDevices(_err, deviceInfo) {
      if (deviceInfo.serialNumber === serialNumber) {
        self._client = self._wemo.client(deviceInfo);
        self._client.on("binaryState", self._runChangeListeners.bind(self));
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
        reject(new Error("Client not ready yet, please wait"));
      }
    });
  }

  setState(state) {
    // takes a boolean value, converting
    // the boolean to a number
    return new Promise((resolve, reject) => {
      if (this.clientReady) {
        this._client.setBinaryState(Number(state), (err, _response) =>
          err ? reject(err) : resolve()
        );
      } else {
        reject(new Error("Client not ready yet, please wait"));
      }
    });
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
      listener(Boolean(value));
    }
  }
};

// var Wemo = require('wemo-client');
// var wemo = new Wemo();

// wemo.discover(function(err, deviceInfo) {
//   console.log('Wemo Device Found: %j', deviceInfo.serialNumber);

//   // Get the client for the found device
//   var client = wemo.client(deviceInfo);

//   // You definitely want to listen to error events (e.g. device went offline),
//   // Node will throw them as an exception if they are left unhandled
//   client.on('error', function(err) {
//     console.log('Error: %s', err.code);
//   });

//   // Handle BinaryState events
//   client.on('binaryState', function(value) {
//     console.log('Binary State changed to: %s', value);
//   });

//   // Turn the switch on
//   client.setBinaryState(1);
// });
