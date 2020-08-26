// @fileoverview A collection of functions that are needed to parse commands.

/* eslint-disable */

// Parses delete commands
// @param {string[]} p: the list of white space separated words
// @returns {string[]} the parsed command array
export function parseDel(p) {
    p[0] = 'delete ' + (p.length === 3 ? 'edge' : 'node')
    return p
}

// Parses add commands
// @param {string[]} p: the list of white space separated words
// @returns {string[]} the parsed command array
export function parseAdd(p) {
    if (p.length === 1 && !p[0].includes('+')) {
        return ['add node', p[0]]
    } else {
        return ['add edge'].concat(p)
    }
}

// Parses coloring commands
// @param {string[]} p: the list of white space separated words
// @returns {string[]} the parsed command array
export function parseColor(p) {
    if (p.length === 3) {
        return ['color node', p[1], p[2]]
    }
    if (p.length === 4) {
        return ['color edge', p[1], p[2], p[3]]
    }
    return ['no command']
}
