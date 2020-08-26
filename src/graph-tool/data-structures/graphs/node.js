// @fileoverview Object constructor for an node.

/* eslint-disable */

// A Node object stores all the relevant data needed to render a Node and
// run algorithms that include that Node.
export default function Node(label, radius, color, x, y) {

    // @private {string} The textual label for the node that gets rendered.
    this.label = label;

    // @private {number} The radius of the node render.
    this.radius = radius;

    // @private {string} The color of the node render.
    this.color = color;

    // @private {number} The x position of the node. This is on range [0, 1].
    this.x = x;

    // @private {number} The y position of the node. This is on range [0, 1].
    this.y = y;
}
