import * as Colors from '../assets/Colors.js'
import * as Gmy from './Geometry.js'

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

export function fillText(ctx, canvas, msg, cx, cy, color, size = 12) {
    let {w, h} = getCanvasDimensions(canvas)
    ctx.fillStyle = color
    ctx.font = size.toString() + 'px Roboto'
    ctx.fillText(msg, cx * w, cy * h)
}

export function drawEdge(ctx, canvas, edge, color, directed, bs, weighted, selected) {
    let dims = getCanvasDimensions(canvas)
    const bendstyle = bs ? 1 : 0
    const fn = edge.u
    const tn = edge.v
    const scaledFn = Gmy.toScale(fn, dims)
    const scaledTn = Gmy.toScale(tn, dims)
    const frad = fn.radius
    const trad = tn.radius
    const dist = Gmy.dist(scaledFn, scaledTn)
    const angle = Gmy.angleBetween(scaledFn, scaledTn)
    const perp = angle + (Math.PI / 2)
    const mid = Gmy.scale(Gmy.add(scaledTn, scaledFn), 0.5)
    const bez = Gmy.add(mid, Gmy.baseVectors(Math.min(40, 200 * (100 / dist)), perp))
    const offsetf = Gmy.baseVectors(frad, angle)
    const offsett = Gmy.baseVectors(trad, angle)
    const otherf = Gmy.baseVectors(0.5 * frad * bendstyle, perp)
    const othert = Gmy.baseVectors(0.5 * trad * bendstyle, perp)
    const padf = Gmy.add(Gmy.add(scaledFn, offsetf), otherf)
    const padt = Gmy.add(Gmy.subtract(scaledTn, offsett), othert)

    ctx.lineWidth = selected ? 2 : 1
    ctx.beginPath()

    // text stuff
    let weightPos = Gmy.toMinmap((bs ? bez : Gmy.add(mid, Gmy.baseVectors(10, perp))), dims)
    if (weighted) {
        fillText(ctx, canvas, edge.weight, weightPos.x, weightPos.y, 'black')
    }
    if (edge.eulerianMarker !== null) {
        weightPos = Gmy.toMinmap(Gmy.add(Gmy.toScale(weightPos, dims), Gmy.baseVectors(-20, perp)), dims)
        fillText(ctx, canvas, edge.eulerianMarker, weightPos.x, weightPos.y, Colors.LIGHT_RED)
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
        let arrowAng = bendstyle === 0 ? angle - (bendstyle * Math.PI / 7.5) : Gmy.angleBetween(bez, padt)
        arrowHead(ctx, padt.x, padt.y, arrowAng)
        ctx.closePath()
        ctx.fill()
    }
}

function arrowHead(context, tox, toy, angle) {
    const headlen = 8
    context.moveTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
}

function getCanvasDimensions(canvas) {
    return  {w: canvas.width, h: canvas.height}
}

export function clearAndPrepare(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
}
