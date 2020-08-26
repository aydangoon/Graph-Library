// @fileoverview Object constructor for a graph. Note, the graph contains edge visuals and
// node visuals which have extra data such as (x, y) position that is **not** fundamental
// to the raw data of the graph.

/* eslint-disable */

import RawGraph from './rawgraph.js'
import Edge from './edge.js'
import Node from './node.js'


// A Graph object is an object that contains data and functions necessary
// for the rendering and changing of state of a graph.
export default function Graph(directed = true, weighted = false) {

    // @private {boolean} If the graph is directed or not.
    this.directed = directed

    // @private {boolean} If the graph is weighted or not.
    this.weighted = weighted

    // @private {boolean} If the graph is simple or not.
    this.simple = true

    // @private {!Edge[]} An exhaustive list of Edge objects that are absolutely
    // necessary to render the current graph state.
    this.edges = {}

    // @private {!Node[]} An exhaustive list of Node objects that are absolutely
    // necessary to render the current graph state.
    this.nodes = {}

    // @private {integer} The total number of nodes in the current graph state.
    this.nodeCount = 0

    // @private {!RawGraph} The fundamental raw graph data associated directly with the
    // current graph state.
    this.raw = new RawGraph(directed, weighted)

    this.changeProp = (setting, value) => {
        this[setting] = value
        this.raw[setting] = value
    }

    this.hasEdge = function() {
        let u, v
        if (typeof arguments[0] === 'object') {
            u = arguments[0].u.label
            v = arguments[0].v.label
        } else {
            u = arguments[0]
            v = arguments[1]
        }
        return this.raw.hasEdge(u, v)
    }

    this.getEdge = (u, v) => {
        let key = this.edgeKey(u, v)
        if (this.edges.hasOwnProperty(key)) {
            return this.edges[key]
        }
        key = this.edgeKey(v, u)
        if (!this.directed && this.edges.hasOwnProperty(key)) {
            return this.edges[key]
        }
        return null
    }

    this.hasNode = function() {
        // if the object passsed is a node
        if (typeof arguments[0] === 'object') {
            return this.raw.hasNode(arguments[0].label)
        }
        // otherwise if it is a label
        return this.raw.hasNode(arguments[0])
    }

    this.addEdge = function() {
        let edge, key, opkey, weight, u, v
        if (arguments.length === 1) {
            edge = arguments[0]
            u = edge.u.label
            v = edge.v.label
            weight = edge.weight
        } else {
            u = arguments[0]
            v = arguments[1]
            const style = arguments[2]
            const uNode = this.nodes[u]
            const vNode = this.nodes[v]
            weight = arguments[3] !== undefined ? parseInt(arguments[3]) : style.weight
            edge = new Edge(uNode, vNode, style.edgeColor, weight)
        }

        key = this.edgeKey(u, v)
        opkey = this.edgeKey(v, u)

        this.raw.addEdge(u, v, weight)
        this.edges[key] = edge

        if (this.directed && this.edges.hasOwnProperty(opkey)) {
            this.edges[opkey].bent = true
            this.edges[key].bent = true
        }
        return edge
    }

    this.addNode = function() {
        let node, key
        if (arguments.length === 1) {
            node = arguments[0]
            key = this.nodeKey(node.label)

        } else {
            let label = arguments[0]
            let style = arguments[1]
            let x, y
            if (arguments.length === 4) {
                x = arguments[2]
                y = arguments[3]
            } else {
                const randPos = this.nextRandomNodePos()
                x = randPos.x
                y = randPos.y
            }
            node = new Node(label, style.nodeRadius, style.nodeColor, x, y)
            key = this.nodeKey(label)
        }
        this.raw.addNode(key)
        this.nodes[key] = node
        this.nodeCount++
        return node
    }

    this.removeNode = function() {
        let node, key
        if (typeof arguments[0] === 'object') {
            node = arguments[0]
            key = this.nodeKey(node.label)
        } else {
            key = this.nodeKey(arguments[0])
            node = this.nodes[key]
        }
        this.raw.removeNode(key)
        delete this.nodes[key]
        this.nodeCount--
        return node
    }

    this.removeEdge = function() {
        let edge, key, opkey, u, v
        if (typeof arguments[0] === 'object') {
            edge = arguments[0]
            u = edge.u.label
            v = edge.v.label
            key = this.edgeKey(u, v)
            opkey = this.edgeKey(v, u)
        } else {
            u = arguments[0]
            v = arguments[1]
            if (this.edges[this.edgeKey(u, v)] === undefined && !this.directed) {
                key = this.edgeKey(v, u)
                opkey = this.edgeKey(u, v)
            } else {
                key = this.edgeKey(u, v)
                opkey = this.edgeKey(v, u)
            }
            edge = this.edges[key]
        }

        this.raw.removeEdge(u, v)
        delete this.edges[key]

        if (this.directed && this.edges.hasOwnProperty(opkey)) {
            this.edges[opkey].bent = false
        }

        return edge
    }

    this.getWeight = (u, v) => {
        return this.raw.getWeight(u, v)
    }

    this.setWeight = (u, v, w) => {
        let nw = parseInt(w)
        let key = this.edgeKey(u, v)
        let opkey = this.edgeKey(v, u)
        if (this.edges.hasOwnProperty(key)) {
            this.edges[key].weight = nw
        } else if (!this.directed && this.edges.hasOwnProperty(opkey)) {
            this.edges[opkey].weight = nw
        }
        this.raw.setWeight(u, v, nw)
    }

    this.getAllEdgesIncidentOn = (node) => {
        return this.raw.getAllEdgesIncidentOn(node)
    }

    this.getNodeVisuals = () => {
        return Object.values(this.nodes)
    }

    this.getEdgeVisuals = () => {
        return Object.values(this.edges)
    }

    this.getRawGraph = () => {
        return this.raw.clone()
    }

    // helpers
    this.edgeKey = (u, v) => {
        return u + ' ' + v
    }
    this.nodeKey = (u) => {
        return u.toString()
    }
    this.nextRandomNodePos = () => {
        const dst = (this.nodeCount + 10) / (30 - 1)
        const ang = Math.PI * 2 * 1.61803 /*golden ratio*/ * this.nodeCount
        let x = 0.5 + (0.4 * dst * Math.cos(ang))
        let y = 0.5 + (0.4 * dst * Math.sin(ang))
        return {x, y}
    }
    this.getNextNodeLabel = () => {
        let nums = Object.keys(this.nodes).filter(n => !isNaN(parseInt(n))).map(n2 => parseInt(n2))
        let label = 1
        while (nums.indexOf(label) !== -1) {
            label++
        }
        return label.toString()
    }
}
