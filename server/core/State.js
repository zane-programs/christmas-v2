// adapted this from one of my other projects LOL

/**
 * @callback changeCallback
 * @param  {*} value - Value of array element
 * @returns {void}
 */

module.exports = class State {
  constructor(initialState) {
    this._state = typeof initialState === "undefined" ? {} : initialState;
    this._listeners = [];
  }

  /**
   * Gets current state
   */
  get currentState() {
    return this._state;
  }

  /**
   * Updates state
   * @param {*} newState new state value
   */
  setState(newState) {
    this._state = newState;
    for (const listener of this._listeners) {
      listener(newState);
    }
  }

  /**
   * Adds change listener that runs
   * when the state changes
   * @param {changeCallback} listener
   */
  addChangeListener(listener) {
    this._listeners.push(listener);
  }
};
