/* eslint-disable */
export function edgeClicked(mx, my, edge, dims, tol = 20) {
    const fn = edge.u
    const tn = edge.v
    const scaledFn = toScale(fn, dims)
    const scaledTn = toScale(tn, dims)
    const frad = fn.radius
    const trad = tn.radius
    const angle = angleBetween(scaledFn, scaledTn)
    const perp = angle + (Math.PI / 2)
    const padf = add(scaledFn, baseVectors(frad, angle))
    const padt = subtract(scaledTn, baseVectors(trad, angle))

    if (edge.bent) {
        const mid = scale(add(tn, fn), 0.5)
        const uvDist = dist(scaledTn, scaledFn)
        const bez = add(mid, toMinmap(baseVectors(Math.min(40, 200 * (100 / uvDist)), perp), dims))
        let fakeBezNode = {x: bez.x, y: bez.y, radius: 0}
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
        return edgeClicked(mx, my, ub, dims) || edgeClicked(mx, my, vb, dims)
    }

    let offset = baseVectors(tol, perp)
    let ur = add(padf, offset)
    let ul = subtract(padf, offset)
    let ll = subtract(padt, offset)
    let lenY = dist(ur, ul)
    let lenX = dist(ll, ul)
    let newXVec = baseVectors(lenX, angle)
    let newYVec = baseVectors(lenY, perp)

    let lmp = subtract({x: mx, y: my}, ul)

    let projXLen = dot(lmp, newXVec) / len(newXVec)
    let projYLen = dot(lmp, newYVec) / len(newYVec)
    let projectsOntoNewX = projXLen * lenX >= 0 && Math.abs(projXLen) <= lenX
    let projectsOntoNewY = projYLen * lenY >= 0 && Math.abs(projYLen) <= lenY

    return projectsOntoNewX && projectsOntoNewY

}

export function dist(v1, v2) {
    const dx = v2.x - v1.x
    const dy = v2.y - v1.y
    return Math.sqrt((dx * dx) + (dy * dy))
}

export function angleBetween(v1, v2) {
    const dx = v2.x - v1.x
    const dy = v2.y - v1.y
    return Math.atan2(dy, dx)
}

export function add(v1, v2) {
    return {x: v2.x + v1.x, y: v2.y + v1.y}
}

export function subtract(v1, v2) {
    return {x: v1.x - v2.x, y: v1.y - v2.y}
}

export function dot(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y)
}

export function len(v) {
    return dist(v, {x: 0, y: 0})
}

export function scale(v, s) {
    return {x: v.x * s, y: v.y * s}
}

export function toScale(v, {w, h}) {
    return {x: v.x * w, y: v.y * h}
}
export function toMinmap(v, {w, h}) {
    return {x: v.x / w, y: v.y / h}
}

export function normalize(v) {
    return scale(v, 1 / len(v))
}

export function baseVectors(len, ang) {
    return {x: len * Math.cos(ang), y: len * Math.sin(ang)}
}
