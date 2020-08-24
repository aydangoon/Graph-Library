/* eslint-disable */
import Action from '../data-structures/Action.js'
import MinHeap from '../data-structures/heaps/MinHeap.js'
import * as Colors from '../assets/Colors.js'
import * as Graphing from './Graphing.js'

export function color(graph, obj, color, isNode = true) {
    if (isNode && !graph.hasNode(obj)) {
        throw 'node does not exist.'
    } else if (!isNode && !graph.hasEdge(obj[0], obj[1])){
        throw 'edge does not exist.'
    }
    let rgbCol
    switch (color) {
        case 'v':
            rgbCol = Colors.DARK_VIOLET
        break
        case 'b':
            rgbCol = Colors.LIGHT_BLUE
        break
        case 'r':
            rgbCol = Colors.LIGHT_RED
        break
        case 'g':
            rgbCol = Colors.LIGHT_GREEN
        break
        case 'bl':
            rgbCol = '#000000'
        break
        default:
            throw 'no such color.'
    }

    if (isNode) {
        let prev = graph.nodes[obj].color
        let curr = rgbCol
        graph.nodes[obj].color = rgbCol
        return new Action('color node', {node: graph.nodes[obj], colorLetter: color, prev, curr})
    } else {
        let edge = graph.getEdge(obj[0], obj[1])
        let prev = edge.color
        edge.color = rgbCol
        return new Action('color edge', {edge, prev, curr: rgbCol, colorLetter: color})
    }
}

export function dijkstra(graph, s, e) {
    if (s === undefined || e === undefined || !graph.hasNode(s) || !graph.hasNode(e)) {
        throw 'source or end node not in graph.'
    }

    let raw = graph.getRawGraph()
    let actions = [new Action('dijkstra', {s, e})]

    let dist = {}
    let parent = {}
    let pq = new MinHeap()

    raw.getNodes().forEach(node => {
        pq.insert(node)
        parent[node] = null
    })
    pq.decreaseKey(pq.indexOf(s), 0)

    while (!pq.isEmpty()) {

        let dist = pq.getKey(0)
        let u = pq.extractMin()

        raw.getAdjacencyList(u).forEach(v => {
            let w = raw.getWeight(u, v)

            if (w < 0) {
                throw 'negative edge weight exists.'
            }

            let vInd = pq.indexOf(v)

            if (vInd !== -1 && pq.getKey(vInd) > dist + w) {
                pq.decreaseKey(vInd, dist + w)
                parent[v] = u
            }
        })
    }
    let current = e
    let currParent
    while (current !== null) {
        currParent = parent[current]
        if (currParent !== null) {
            actions.push(color(graph, [currParent, current], 'r', false))
        }
        current = currParent
    }
    return actions
}

export function bellmanFord(graph, s, e) {

    if (!graph.hasNode(s) || !graph.hasNode(e)) {
        throw 'source or end node not in graph.'
    }

    let raw = graph.getRawGraph()
    let nodes = raw.getNodes()
    let edges = raw.getEdges()
    let actions = [new Action('belford', {s, e})]

    let dist = {}
    let parent = {}

    nodes.forEach(node => {
        dist[node] = 9999
        parent[node] = null
    })

    dist[s] = 0
    for (let i = 1; i < nodes.length; i++) {
        edges.forEach(([u, v]) => {
            if (dist[u] + raw.getWeight(u, v) < dist[v]) {
                dist[v] = dist[u] + raw.getWeight(u, v)
                parent[v] = u
            }
        })
    }

    edges.forEach(([u, v]) => {
        if (dist[u] + raw.getWeight(u, v) < dist[v]) {
            throw 'negative cycle.'
        }
    })

    let current = e
    let currParent
    while (current !== null) {
        currParent = parent[current]
        if (currParent !== null) {
            actions.push(color(graph, [currParent, current], 'r', false))
        }
        current = currParent
    }
    return actions

}

export function colorAll(graph) {
    let raw = graph.getRawGraph().getUnderlyingGraph()
    let ncolor = {}
    let actions = [new Action('colorall')]
    raw.getNodes().forEach(node => {
        ncolor[node] = 0
    })
    raw.getNodes().forEach(node => {
        let goodCols = [1, 2]
        raw.getAdjacencyList(node).forEach(node2 => {
            if (ncolor[node2] !== 0) {
                let index = goodCols.indexOf(ncolor[node2])
                if (index !== -1) {
                    goodCols.splice(index, 1)
                }
            }
            raw.removeEdge(node, node2)
        })
        if (goodCols.length === 0) {
            throw 'graph is not bipartite.'
        }
        ncolor[node] = goodCols[0]
    })
    Object.entries(ncolor).forEach(([nodeLabel, colorNum]) => {
        let col
        switch(colorNum) {
            case 1: col = 'r'; break
            case 2: col = 'b'; break
            case 3: col = 'v'; break
            case 4: col = 'g'; break
        }
        actions.push(color(graph, nodeLabel, col))
    })
    return actions
}

export function eulerianCircuit(graph) {

    if (graph.directed) {
        throw 'cannot check on directed graph.'
    }

    let raw = graph.getRawGraph()
    let edgeCount = 0
    let currentNode = null
    for (let node in raw.al) {
        let edges = raw.al[node].length
        if (edges % 2 !== 0) {
            throw 'no eulerian circuit.'
        }
        edgeCount += edges
        if (edges > 0) {
            currentNode = node
        }
    }
    edgeCount /= 2
    let next
    let circuit = []
    while (edgeCount > 0 && currentNode !== null) {
        next = raw.al[currentNode][0]
        raw.removeEdge(currentNode, next)
        circuit.push([currentNode, next])
        currentNode = next
        edgeCount--
    }

    let actions = [new Action('eulcirc')]
    let edge
    circuit.forEach(([u, v], i) => {
        edge = graph.getEdge(u, v)
        actions.push(new Action('eulerian mark', {edge, prev: edge.eulerianMarker, mark: i + 1}))
        edge.eulerianMarker = i + 1
    })
    return actions
}

export function eulerianPath(graph) {

    if (graph.directed) {
        throw 'cannot check on directed graph.'
    }

    let raw = graph.getRawGraph()
    let edgeCount = 0
    let currentNode = null
    for (let node in raw.al) {
        let edges = raw.al[node].length
        if (edges % 2 !== 0 || currentNode === null) {
            currentNode = node
        }
        edgeCount += edges
    }
    edgeCount /= 2

    let next
    let circuit = []
    while (edgeCount > 0 && currentNode !== null) {
        if (raw.al[currentNode].length === 0 && edgeCount > 0) {
            throw 'no eulerian path.'
        } else if (raw.al[currentNode].length === 1) {
            next = raw.al[currentNode][0]
        } else {
            let rawccs = Graphing.exhaustiveBFS(raw).ccs
            for (let i = 0; i < raw.al[currentNode].length; i++) {
                let clone = raw.clone()
                let other = raw.al[currentNode][i]
                clone.removeEdge(currentNode, other)
                next = other
                let cloneccs = Graphing.exhaustiveBFS(clone).ccs
                if (cloneccs === rawccs) {
                    break
                }
            }
        }
        raw.removeEdge(currentNode, next)
        circuit.push([currentNode, next])
        currentNode = next
        edgeCount--
    }
    let actions = [new Action('eulpat')]
    let edge
    circuit.forEach(([u, v], i) => {
        edge = graph.getEdge(u, v)
        actions.push(new Action('eulerian mark', {edge, prev: edge.eulerianMarker, mark: i + 1}))
        edge.eulerianMarker = i + 1
    })
    return actions
}

export function clearVisualizations(graph) {
    let raw = graph.getRawGraph()
    let edges = raw.getEdges()
    let nodes = raw.getNodes()
    let actions = [new Action('clearvis')]
    edges.forEach(([u, v]) => {
        actions.push(color(graph, [u, v], 'bl', false))
        let edge = graph.getEdge(u, v)
        if (edge.eulerianMarker !== null) {
            //console.log('edge', u, v, 'has eul mark', edge.eulerianMarker)
            actions.push(new Action('eulerian mark', {edge, prev: edge.eulerianMarker, mark: null}))
            edge.eulerianMarker = null
        }
    })
    nodes.forEach(n => {
        actions.push(color(graph, n, 'bl'))
    })
    return actions
}
// not the greatest implementation. Try and improve this later on.
export function stoerWagner(graph) {
    if (graph.directed) {
        throw 'cannot do Stoer Wagner on directed graph.'
    }

    let raw = graph.getRawGraph()
    if (Graphing.exhaustiveBFS(raw).ccs > 1) {
        throw 'graph is already cut.'
    }

    raw.weighted = true
    let minCut = 9999
    let fg1, fg2
    let safety = 0
    while (raw.getNodes().length > 1) {
        let {g1, g2, cutOfThePhase} = stoerWagnerHelp(raw)
        if (cutOfThePhase < minCut) {
            fg1 = g1
            fg2 = g2
            minCut = cutOfThePhase
        }
        safety++
        if (safety > 20) {throw 'safety triggered'}
    }
    let actions = [new Action('stowag')]
    let group1 = (fg1.map(gn => gn.split('').filter(l => l !== '(' && l !== ')'))).toString().split(',')
    let group2 = (fg2.map(gn => gn.split('').filter(l => l !== '(' && l !== ')'))).toString().split(',')
    group1.forEach(n1 => {
        group2.forEach(n2 => {
            if (graph.hasEdge(n1, n2)) {
                actions.push(color(graph, [n1, n2], 'r', false))
            }
        })
    })
    return actions
}

function stoerWagnerHelp(raw) {
    let nodes = raw.getNodes()
    let a = nodes[0]
    let visited = [a]
    let safety = 0
    while (visited.length !== nodes.length) {
        let toAdd = null
        let largestConnection = 0
        nodes.forEach(node => {
            if (visited.indexOf(node) !== -1) {
                return
            }
            let weightToVisited = 0
            raw.getAdjacencyList(node).forEach(other => {
                if (visited.indexOf(other) !== -1) {
                    weightToVisited += raw.getWeight(node, other)
                }
            })
            if (weightToVisited > largestConnection) {
                toAdd = node
                largestConnection = weightToVisited
            }
        })
        visited.push(toAdd)

        safety++
        if (safety > 100) {throw 'stoer wagner helper safety triggered'}
    }
    let t = visited.pop()
    let s = visited[visited.length - 1]
    let merge = '(' + s + t + ')'
    raw.addNode(merge)
    let cutOfThePhase = 0
    let w
    raw.getAdjacencyList(t).forEach(node => {
            w = raw.getWeight(t, node)
            if (node !== s && !raw.hasEdge(merge, node)) {
                raw.addEdge(merge, node, w)
            }
            cutOfThePhase += w
    })
    raw.getAdjacencyList(s).forEach(node => {
        if (node !== t) {
            w = raw.getWeight(s, node)
            if (!raw.hasEdge(merge, node)) {
                raw.addEdge(merge, node, w)
            } else {
                raw.increaseWeight(merge, node, w)
            }
        }
    })
    raw.completelyRemoveNode(s)
    raw.completelyRemoveNode(t)
    return {g1: [t], g2: visited, cutOfThePhase}
}
