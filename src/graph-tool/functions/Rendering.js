// @fileoverview A collection of functions related to rendering different objects
// to the graph render.

/* eslint-disable */

import * as colors from '../assets/Colors.js'
import * as gmy from './Geometry.js'

// fills a circle at a certain position with a radius, color, and possibly with
// a border.
// @param {RenderingContext} ctx: A canvas 2d context
// @param {HTMLElement} canvas: the canvas
// @param {number} cx: the center x position
// @param {number} cy: the center y position
// @param {number} rad: the circle radius
// @param {string} color: the circle color
// @param {boolean} border: whether the circle as has a black border or not
export function fillCircle(ctx, canvas, cx, cy, rad, color, border = false) {
    let {w, h} = getCanvasDimensions(canvas)
    ctx.beginPath()
    ctx.arc(cx * w, cy * h, rad, 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
    if (border) {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'black'
        ctx.stroke()
    }
}

// Fills text on canvas. The center of the text is defined by (cx, cy).
// @param {RenderingContext} ctx: A canvas 2d context
// @param {HTMLElement} canvas: the canvas
// @param {string} msg: the string message
// @param {number} cx: the center x position
// @param {number} cy: the center y position
// @param {string} color: the circle color
// @param {number} size: the font size
export function fillText(ctx, canvas, msg, cx, cy, color, size = 12) {
    let {w, h} = getCanvasDimensions(canvas)
    ctx.fillStyle = color
    ctx.font = size.toString() + 'px Roboto'
    ctx.fillText(msg, cx * w, cy * h)
}

// Draws an edge to the canvas.
// @param {RenderingContext} ctx: A canvas 2d context
// @param {HTMLElement} canvas: the canvas
// @param {!Edge} edge: the edge to draw
// @param {string} color: the circle color
// @param {boolean} directed: if the graph is directed or not
// @param {boolean} bs: the bend style of the edge, if true the edge is bent
// @param {boolean} weighted: if the graph is weighted or not
// @param {boolean} selected: if the current edge is selected or not
export function drawEdge(ctx, canvas, edge, color, directed, bs, weighted, selected) {
    let dims = getCanvasDimensions(canvas)
    const bendstyle = bs ? 1 : 0
    const fn = edge.u
    const tn = edge.v
    const scaledFn = gmy.toScale(fn, dims)
    const scaledTn = gmy.toScale(tn, dims)
    const frad = fn.radius
    const trad = tn.radius
    const dist = gmy.dist(scaledFn, scaledTn)
    const angle = gmy.angleBetween(scaledFn, scaledTn)
    const perp = angle + (Math.PI / 2)
    const mid = gmy.scale(gmy.add(scaledTn, scaledFn), 0.5)
    const bez = gmy.add(mid, gmy.baseVectors(Math.min(40, 200 * (100 / dist)), perp))
    const offsetf = gmy.baseVectors(frad, angle)
    const offsett = gmy.baseVectors(trad, angle)
    const otherf = gmy.baseVectors(0.5 * frad * bendstyle, perp)
    const othert = gmy.baseVectors(0.5 * trad * bendstyle, perp)
    const padf = gmy.add(gmy.add(scaledFn, offsetf), otherf)
    const padt = gmy.add(gmy.subtract(scaledTn, offsett), othert)

    ctx.lineWidth = selected ? 2 : 1
    ctx.beginPath()

    // text stuff
    let weightPos = gmy.toMinmap((bs ? bez : gmy.add(mid, gmy.baseVectors(10, perp))), dims)
    if (weighted) {
        fillText(ctx, canvas, edge.weight, weightPos.x, weightPos.y, 'black')
    }
    if (edge.eulerianMarker !== null) {
        weightPos = gmy.toMinmap(gmy.add(gmy.toScale(weightPos, dims), gmy.baseVectors(-20, perp)), dims)
        fillText(ctx, canvas, edge.eulerianMarker, weightPos.x, weightPos.y, colors.LIGHT_RED)
    }

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.moveTo(padf.x , padf.y)

    if (bendstyle === 0) {
        ctx.lineTo(padt.x, padt.y)
    } else {
        ctx.quadraticCurveTo(bez.x, bez.y, padt.x, padt.y)
    }

    ctx.stroke()
    ctx.closePath()

    if (directed) {
        ctx.beginPath()
        let arrowAng = bendstyle === 0 ? angle - (bendstyle * Math.PI / 7.5) : gmy.angleBetween(bez, padt)
        arrowHead(ctx, padt.x, padt.y, arrowAng)
        ctx.closePath()
        ctx.fill()
    }
}

// Draws an arrow head at a specific point.
// @param {RenderingContext} context: A canvas 2d context
// @param {number} tox: the x position
// @param {number} toy: the y position
// @param {number} angle: the angle in radians between the line body of the arrow and the node
// it points to
function arrowHead(context, tox, toy, angle) {
    const headlen = 8
    context.moveTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
}

// Gets the current dimension of the canvas passed to it.
// @param {HTMLElement}  canvas: the canvas
// @return Object with fields w, h, where w is width and h is height
function getCanvasDimensions(canvas) {
    return  {w: canvas.width, h: canvas.height}
}

// Clears the context and prepares it to center text
// @param {RenderingContext} ctx: the context
export function clearAndPrepare(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
}
