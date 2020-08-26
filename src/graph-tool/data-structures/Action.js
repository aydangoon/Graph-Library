// @fileoverview Object constructor for an Action.

/* eslint-disable */

// An Action is an object that stores a name for what action occured,
// and an object reference, an "item", upon which the action happened/should
// happen to.
export default function Action(name, item = null) {

    // @private {string} the name of the command. i.e. "del 1", "kosaraju", "1 2".
    this.name = name

    // @private {Object} a reference to the object/objects upon which the action happened
    // or should happen to.
    this.item = item

}
