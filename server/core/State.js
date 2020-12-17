// adapted this from one of my other projects LOL

module.exports = class State {
  constructor(initialState) {
    this._state = typeof initialState === "undefined" ? {} : initialState;
    this._listeners = [];
  }

  get currentState() {
    return this._state;
  }

  setState(newState) {
    this._state = newState;
    for (const listener of this._listeners) {
      listener(newState);
    }
  }

  addChangeListener(listener) {
    this._listeners.push(listener);
  }
};
