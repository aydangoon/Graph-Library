// @fileoverview Stores functions and helper functions related to reading in a
// json file and converting it to a graph object.

/* eslint-disable */

import Graph from '../../data-structures/graphs/graph.js'

// Parses a graph object that was stored in json and only returns it
// if it is a valid graph object.
// @param {Object} fgraph: An object that has all the data to recreate a Graph object
// @returns {Object} fgraph if it is valid
export default function parseJSONInput(fgraph) {
    if (!fgraph.hasOwnProperty('directed')) {
        throw 'missing [directed] property'
    }
    if (!fgraph.hasOwnProperty('weighted')) {
        throw 'missing [weighted] property'
    }
    if (!fgraph.hasOwnProperty('nodes')) {
        throw 'missing [nodes] list'
    }
    if (!fgraph.hasOwnProperty('edges')) {
        throw 'missing [edges] property'
    }

    let tgraph = new Graph(fgraph.directed, fgraph.weighted)
    let nodes = Object.values(fgraph.nodes)
    if (nodes.length > 30) {
        throw 'graph exceeds node limit'
    }
    nodes.forEach(nv => {
        if (!nv.hasOwnProperty('label')) {
            throw 'a node is missing a label'
        } else if (nv.label.includes(' ')) {
            throw 'a node label contains an invalid character'
        }
        let nvl = 'node ' + nv.label
        if (!nv.hasOwnProperty('radius')) {
            throw nvl + ' is missing a radius'
        } else if (isNaN(nv.radius) || nv.radius < 5 || nv.radius > 20) {
            throw nvl + ' has an invalid radius'
        }
        if (!nv.hasOwnProperty('color')) {
            throw nvl + ' is missing a color'
        }
        if (!nv.hasOwnProperty('x')) {
            throw nvl + ' is missing an x position'
        } else if (nv.x < 0 || nv.x > 1) {
            throw nvl + ' x position is out of range [0, 1]'
        }
        if (!nv.hasOwnProperty('y')) {
            throw nvl + ' is missing a y position'
        } else if (nv.y < 0 || nv.y > 1) {
            throw nvl + ' y positin is out of range [0, 1]'
        }
        if (tgraph.hasNode(nv.label)) {
            throw 'duplicate node names'
        }
        tgraph.addNode(nv)
    })
    Object.values(fgraph.edges).forEach(ev => {
        if (!ev.hasOwnProperty('u') || !ev.hasOwnProperty('v')) {
            throw 'an edge is missing one or more nodes'
        }
        let evl = 'edge ' + ev.u.label + ' ' + ev.v.label
        if (!ev.hasOwnProperty('weight')) {
            throw  evl + ' has no [weight] property'
        } else if (isNaN(ev.weight) || Math.abs(ev.weight) > 100) {
            throw evl + ' has an invalid weight property'
        }
        if (!ev.hasOwnProperty('color')) {
            throw evl + ' has no [color] property'
        } else if (!isColor(ev.color)) {
            throw evl + ' has an invalid color'
        }
        if (!ev.hasOwnProperty('bent')) {
            throw evl + ' has no [bent] property'
        } else if (typeof ev.bent !== 'boolean') {
            throw evl + ' has an invalid bent property'
        }
        if (!ev.hasOwnProperty('eulerianMarker')) {
            throw evl + ' has no [eulerianMarker] property'
        } else if (isNaN(ev.eulerianMarker)) {
            throw evl + ' has an invalid eulerianMarker'
        }

        if (tgraph.hasEdge(ev.u.label, ev.v.label)) {
            throw 'duplicate edge'
        }
        if (!tgraph.hasNode(ev.u) || !tgraph.hasNode(ev.v)) {
            throw 'one or more nodes do not exist for an edge'
        }
        let edge = tgraph.addEdge(ev.u.label, ev.v.label, {edgeColor: ev.color}, ev.weight)
        edge.eulerianMarker = ev.eulerianMarker
        edge.bent = ev.bent
    })
    return tgraph
}

// Checks if a string is a color (only colors defined by #)
// @param {string} str: the string to check
// @returns {boolean} if the string is a color string or not
function isColor(str){
    let match = str.match(/#([0-9]|[A-F]){6}/g) // regex for a color of the form # then 6 hex characters
    return match !== null && match.length === 1
}
