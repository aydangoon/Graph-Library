// @fileoverview A collection of functions related to Geometry and Linear Algebra
// needed by the renderer or to detect collisions.

/* eslint-disable */

// Determines whether an edge has been clicked or not.
// @param {number} mx: the mouse x position **to scale** (so not on range [0, 1])
// @param {number} my: the mouse y position **to scale** (so not on range [0, 1])
// @param {!Edge} edge: the edge in question
// @param {Object} dims: the dimensions of the canvas this object contains fields w and h
// @param {number} tol: how much pixel padding tolerance there is on an edge's hitbox
export function edgeClicked(mx, my, edge, dims, tol = 20) {

    // fn: from node, tn: to node
    const fn = edge.u
    const tn = edge.v

    // The (x, y) positions of the two nodes scaled from range [0, 1]
    // to the actual canvas dimensions.
    const scaledFn = toScale(fn, dims)
    const scaledTn = toScale(tn, dims)

    // Node radii.
    const frad = fn.radius
    const trad = tn.radius

    // The angle between the two nodes' positions.
    const angle = angleBetween(scaledFn, scaledTn)
    // The angle perpendicular to that.
    const perp = angle + (Math.PI / 2)

    // The segments of the edge overlapped by node radii.
    const padf = add(scaledFn, baseVectors(frad, angle))
    const padt = subtract(scaledTn, baseVectors(trad, angle))


    if (edge.bent) { // If the edge is bent, to simplify collision we do the following:

        const mid = scale(add(tn, fn), 0.5)
        const uvDist = dist(scaledTn, scaledFn)

        // Determines the Bezier point between the two nodes.
        const bez = add(mid, toMinmap(baseVectors(Math.min(40, 200 * (100 / uvDist)), perp), dims))

        // Create a pseudonode, b, at the Bezier point.
        let fakeBezNode = {x: bez.x, y: bez.y, radius: 0}

        // Create two straight pseudoedges: (u, b) and (b, v)
        let ub = {
            u: fn,
            v: fakeBezNode,
            bent: false
        }
        let vb = {
            u: fakeBezNode,
            v: tn,
            bent: false
        }

        // Return a boolean statement that is true if either of these pseudoedges has
        // been clicked.
        return edgeClicked(mx, my, ub, dims) || edgeClicked(mx, my, vb, dims)
    } else {

        // Create a rectangular hitbox around the edge based on tolerance.
        let offset = baseVectors(tol, perp)
        let ur = add(padf, offset)
        let ul = subtract(padf, offset)
        let ll = subtract(padt, offset)

        // Side lengths of this rectangular hitbox.
        let lenY = dist(ur, ul)
        let lenX = dist(ll, ul)
        let newXVec = baseVectors(lenX, angle)
        let newYVec = baseVectors(lenY, perp)

        // mx, my position moved to coordinate space of this rectangular hitbox.
        let lmp = subtract({x: mx, y: my}, ul)

        // Projects of lmp onto the two base vectors of the rectangular hitbox.
        let projXLen = dot(lmp, newXVec) / len(newXVec)
        let projYLen = dot(lmp, newYVec) / len(newYVec)

        // Boolean statements if these projections land on the base vectors.
        let projectsOntoNewX = projXLen * lenX >= 0 && Math.abs(projXLen) <= lenX
        let projectsOntoNewY = projYLen * lenY >= 0 && Math.abs(projYLen) <= lenY

        // Return a boolean statement that is true iff both projects land on the
        // base vectors.
        return projectsOntoNewX && projectsOntoNewY

    }
}

// Distance between two 2d vectors
// @param {Object} v1: first vector
// @param {Object} v2: second vector
// @returns {number} distance between these vectors
export function dist(v1, v2) {
    const dx = v2.x - v1.x
    const dy = v2.y - v1.y
    return Math.sqrt((dx * dx) + (dy * dy))
}

// Angle between two 2d vectors
// @param {Object} v1: first vector
// @param {Object} v2: second vector
// @returns {number} angle between these vectors in radians
export function angleBetween(v1, v2) {
    const dx = v2.x - v1.x
    const dy = v2.y - v1.y
    return Math.atan2(dy, dx)
}

// Add two 2d vectors
// @param {Object} v1: first vector
// @param {Object} v2: second vector
// @returns {Object} Sum of these vectors
export function add(v1, v2) {
    return {x: v2.x + v1.x, y: v2.y + v1.y}
}

// Subtract two 2d vectors
// @param {Object} v1: first vector, to be subtracted from
// @param {Object} v2: second vector, to subtract
// @returns {Object} Difference of v1 - v2
export function subtract(v1, v2) {
    return {x: v1.x - v2.x, y: v1.y - v2.y}
}

// Dot Product of two 2d vectors
// @param {Object} v1: first vector
// @param {Object} v2: second vector
// @returns {number} Dot product of the vectors
export function dot(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y)
}

// Get length of a vector
// @param {Object} v: vector
// @returns {number} Length of a vector
export function len(v) {
    return dist(v, {x: 0, y: 0})
}

// Scale a vector by an amount
// @param {Object} v1: first vector
// @param {number} s: scalar coefficient
// @returns {Object} Scaled vector
export function scale(v, s) {
    return {x: v.x * s, y: v.y * s}
}

// Scale up a 2d vector with values on range [0, 1] by a width
// and a height
// @param {Object} v: the vector
// @param {number} w: the width to scale up to
// @param {number} h: the height to scale up to
// @returns {Object} The scaled up vector
export function toScale(v, {w, h}) {
    return {x: v.x * w, y: v.y * h}
}

// Scale down a 2d vector with values on range [0, 1] by a width
// and a height
// @param {Object} v: the vector
// @param {number} w: the width to scale down to
// @param {number} h: the height to scale down to
// @returns {Object} The scaled down vector
export function toMinmap(v, {w, h}) {
    return {x: v.x / w, y: v.y / h}
}

// Normalize a vector
// @param {Object} v: the vector
// @returns {Object} The normalized vector
export function normalize(v) {
    return scale(v, 1 / len(v))
}

// Get a vector by defining a magnitude and angle
// @param {number} len: the magnitude of the vector
// @param {number} ang: the angle of the vector in radians
// @returns {Object} The vector defined by those values
export function baseVectors(len, ang) {
    return {x: len * Math.cos(ang), y: len * Math.sin(ang)}
}
