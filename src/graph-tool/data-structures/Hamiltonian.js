import RawGraph from './RawGraph.js'
import Action from './Action.js'
/*
export function hamiltionianCycle(graph) {
    let rc = graph.getRawGraph().clone()
    let al = rc.clone().al
    let s = hcNodeEdges(rc.getNodes().length, rc.getNodes(), al)
    console.log('SAL', s)
    return new Action('nothing', 'nothing', null)
}

function hcNodeEdges(n, vs, es, s = new RawGraph(false)) {
    console.log(s.clone().al)
    if (s.getEdges().length === n) {
        if (isCycle(s)) {
            console.log('it was you')
            return s
        }
    }
    let v = vs[Math.floor(Math.random() * vs.length)]
    if (s.hasNode(v)) {
        vs.splice(vs.indexOf(v), 1)
    }
    while (es[v].length > 0) {
        let eb = es[v].splice(Math.floor(Math.random() * es[v].length), 1)[0]
        es[eb].splice(es[eb].indexOf(v), 1)
        if (!s.hasNode(v)) { s.addNode(v) }
        if (!s.hasNode(eb)) { s.addNode(eb) }
        s.addEdge(v, eb)
        let out = hcNodeEdges(n, vs, es, s)
        if (out !== null) {
            return out
        }
    }
    return null
}

function isCycle(s) {
    let nodes = s.getNodes()
    let curr = nodes[0]
    let first = curr
    let next
    let visted = []
    while (visted.length < nodes.length) {
        next = s.al[curr][0]
        s.removeEdge(curr, next)
        if (visted.length === nodes.length - 1) {
            return next === first
        }
        if (visted.indexOf(next) !== -1) {
            return false
        }
        visted.push(curr)
        curr = next
    }
    return true
}



// this stuff is insane, multipath is a harder algorithm than I thought. come back to it later.


export function hcMultiPath(G, V = G.getNodes(), E = G.al, S = new RawGraph(false)) {
    let stop = forceEdges(G, V, E, S)
    if (stop) {
        return G.getNodes().length === S.getEdges().length ? S : null
    }

    let v = V[Math.floor(Math.random() * V.length)]
    while (E[v].length > 0) {

        let eb = E[v].splice(Math.floor(Math.random() * E[v].length), 1)

        if (!S.hasNode(v)) {
            S.addNode(v)
        }
        if (!S.hasNode(eb)) {
            S.addNode(eb)
        }
        S.addEdge(v, eb)

        if (hcMultiPath(G, V, E, S)) {
            return S
        }
    }
    return null
}

export function forceEdges(G, V, E, S) {
    let M = makeM(G, S)
    let vex = nodesOfDegN(S, 1)
    while (!isConsistent(vex, M)) {
        let {u, v} = getForcedEdge(vex, M)
        S.addEdge(u, v)
        M = makeM(G, S)
        vex = nodesOfDegN(S, 1)
        if (isStoppingCondition(S, M)) {
            return true
        }
    }
    return false
}

export function isConsistent(vex, M) {
    M.getNodes().forEach(node => {
        if (vex.indexOf(node) !== -1 && M.al[node].length <= 1) {
            return false
        } else if (vex.indexOf(node === -1) && M.al[node].length <= 2) {]
            return false
        }
    })
    return true
}

function isStoppingCondition(S, M) {

}

function nodesOfDegN(g, n) {
    return g.getNodes().map(node => g.al[node].length === n)
}

function makeM(G, S) {
    let M = G.clone()
    let vin = nodesOfDegN(S, 2)
    vin.forEach(node => {
        let edgesToRemove = M.getAllEdgesIncidentOn(node)
        edgesToRemove.forEach(([u, v]) => {
            M.removeEdge(u, v)
        })
        M.removeNode(node)
    })
    return M
}
*/
