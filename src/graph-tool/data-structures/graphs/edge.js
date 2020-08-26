// @fileoverview Object constructor for an edge.

/* eslint-disable */

// An Edge object stores all the relevant data needed to render an edge and
// run algorithms that include that edge.
export default function Edge(u, v, color, weight) {

    // @private {!Node} The starting node of the edge.
    this.u = u

    // @private {!Node} The ending node of the edge.
    this.v = v

    // @private {boolean} Whether the edge should render as bent or not.
    this.bent = false

    // @private {number} Weight of the edge.
    this.weight = weight

    // @private {string} The color of the edge.
    this.color = color

    // @private {number} When this edge is visited in an Eulerian path or circuit.
    this.eulerianMarker = null

}
