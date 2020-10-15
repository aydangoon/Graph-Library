// @fileoverview A collection of functions that transform the state of the graph.
// Each function changes the graph object's state in some way, and returns a list
// of actions corresponding to what those changes were.

/* eslint-disable */

import Action from '../../data-structures/Action.js'
import MinHeap from '../../data-structures/heaps-and-stacks/minheap.js'

// Removes all nodes and edges in the graph.
// @param {!Graph} graph: the graph to clear
// @returns {!Action[]} list of corresponding actions
export function clear(graph) {

    let actions = [new Action('clear')]
    let nodes = graph.getNodeVisuals()
    nodes.forEach(node => {
        actions.push(deleteNode(graph, node.label))
    })
    return actions
}

// Removes a node and all its incident edges from the graph.
// @param {!Graph} graph: the graph to clear
// @param {string} nodeLabel: the label of the node to be removed
// @returns {!Action[]} list of corresponding actions
export function deleteNode(graph, nodeLabel) {
    if (!graph.hasNode(nodeLabel)) {
        throw 'Node does not exist.'
    }

    let actions = []
    graph.getAllEdgesIncidentOn(nodeLabel).forEach(([u, v]) => {
        actions.push(new Action('delete edge', graph.removeEdge(u, v)))
    })
    actions.push(new Action('delete node', graph.removeNode(nodeLabel)))
    return actions
}

// Turns the graph into a tree by running a BFS from a source node and removing
// all edges that would create cycles in the BFS tree rooted from the source node.
// @param {!Graph} graph: the graph to clear
// @param {string} root: the root node's label
// @param {Object<string, string} parentOf; matches child nodes to their parent nodes
// in the BFS tree
// @returns {!Action[]} list of corresponding actions
export function BFS(graph, root, parentOf = {}) {

    if (root === undefined) {
        throw 'source node is undefined.'
    }
    if (root === null) {
        root = Object.keys(graph.nodes)[0]
    }

    let queue = []
    let actions = [new Action('bfs', graph.nodes[root])]

    const raw = graph.getRawGraph()

    queue.unshift(root)
    parentOf[root] = root

    while (queue.length > 0) {

        let parent = queue.pop()

        raw.getAdjacencyList(parent).forEach(child => {
            if (parentOf[child] != null) {
                let removedEdge = graph.removeEdge(parent, child)
                actions.push(new Action('delete edge', removedEdge))
            } else {
                parentOf[child] = parent
                queue.unshift(child)
            }
            raw.removeEdge(parent, child)
        })
    }
    return actions
}

// Completely connects the entire graph or just a subset of nodes.
// @param {!Graph} graph: the graph to clear
// @param {Object} style: the graph style (necessary for when edges are created such that
// they have styles matching the current edge styles)
// @param {string[]} nodes: the node labels of the nodes that should be completely
// connected
// @returns {!Action[]} list of corresponding actions
export function completelyConnected(graph, style, nodes) {

    if (nodes === null) {
        nodes = Object.keys(graph.nodes)
    }

    nodes.forEach(n => {
        if (!graph.hasNode(n)) {
            throw 'a node specificed is not in the graph.'
        }
    })

    let actions = [new Action('cc')]

    nodes.forEach(fNode => {
        nodes.forEach(tNode => {
            if (fNode !== tNode && !graph.hasEdge(fNode, tNode)) {
                actions.push(new Action('add edge', graph.addEdge(tNode, fNode, style)))
                if (graph.directed) {
                    actions.push(new Action('add edge', graph.addEdge(fNode, tNode, style)))
                }
            }
        })
    })
    return actions
}

// Turns the graph into its transpose.
// @param {!Graph} graph: the graph to clear
// @param {Object} style: the graph style (necessary for when edges are created such that
// they have styles matching the current edge styles)
// @returns {!Action[]} list of corresponding actions
export function transpose(graph, style) {

    if (!graph.directed) {
        throw 'cannot make transpose of undirected graph.'
    }

    let transposeEdges = []
    let nodes, u, v, weight
    let actions = [new Action('trans')]
    graph.getEdgeVisuals().forEach(edge => {
        u = edge.v.label
        v = edge.u.label
        weight = graph.getWeight(v, u)
        actions.push(new Action('delete edge', edge))
        transposeEdges.push([u, v, weight])
        graph.removeEdge(edge)
    })
    transposeEdges.forEach(([a, b, w]) => {
        actions.push(new Action('add edge', graph.addEdge(a, b, style, w)))
    })
    return actions
}

// Turns the graph into its complement.
// @param {!Graph} graph: the graph to clear
// @param {Object} style: the graph style (necessary for when edges are created such that
// they have styles matching the current edge styles)
// @returns {!Action[]} list of corresponding actions
export function complement(graph, style) {

    if (graph.directed) {
        throw 'cannot create complement for directed graph.'
    }

    let actions = [new Action('comp')]
    const raw = graph.getRawGraph()
    const rawNodes = raw.getNodes()
    graph.getEdgeVisuals().forEach(edge => {
        actions.push(new Action('delete edge', graph.removeEdge(edge)))
    })

    let u, v
    for (let i = 0; i < rawNodes.length; i++) {
        for (let j = i + 1; j < rawNodes.length; j++) {
            u = rawNodes[i]
            v = rawNodes[j]
            if (!raw.hasEdge(u, v)) {
                actions.push(new Action('add edge', graph.addEdge(u, v, style)))
            }
        }
    }
    return actions
}

// Turns the graph into its corresponding strongly connected component graph.
// @param {!Graph} graph: the graph to clear
// @param {Object} style: the graph style (necessary for when edges are created such that
// they have styles matching the current edge styles)
// @returns {!Action[]} list of corresponding actions
export function kosaraju(graph, style) {

    if (!graph.directed) {
        throw 'cannot make strongly connected components for undirected graph.'
    }

    let raw = graph.getRawGraph()
    let transpose = raw.getTranspose()

    let f = exhaustiveDFS(raw).finished

    let nodes = Object.keys(f).map((key) => [key, f[key]]).sort((first, second) => second[1] - first[1]).map(keyValPair => keyValPair[0])

    let outputDFS = exhaustiveDFS(transpose, nodes)

    let actions = [new Action('kosaraju'), clear(graph)]
    let sccs = Object.keys(outputDFS.trees)
    sccs.forEach(scc => {
        actions.push(new Action('add node', graph.addNode(scc, style)))
    })
    sccs.forEach(scc1 => {
        sccs.forEach(scc2 => {
            if (scc1 !== scc2) {
                let nodes1 = outputDFS.trees[scc1]
                let nodes2 = outputDFS.trees[scc2]
                for (let i = 0; i < nodes1.length; i++) {
                    let con = raw.getAdjacencyList(nodes1[i])
                    for (let j = 0; j < con.length; j++) {
                        if (nodes2.indexOf(con[j]) !== -1) {
                            let sccEdge = graph.addEdge(scc1, scc2, style)
                            actions.push(new Action('add edge', sccEdge))
                            i = nodes1.length
                            j = con.length
                        }
                    }
                }
            }
        })
    })
    return actions
}

//TODO: Why are exhaustiveDFS and DFS here??? They aren't even transformative functions
export function exhaustiveDFS(raw, nodes = Object.keys(raw.al)) {

    let trees = {}
    const colorOf = {}
    const d = {}
    const f = {}
    let time = 0

    nodes.forEach(node => {colorOf[node] = 0}) // 0: white, 1: grey, 2: black
    nodes.forEach(node => {
        if (colorOf[node] === 0) {
            let outputDFS = DFS(raw, node, colorOf, d, f, time, [], "")
            time = outputDFS.time
            trees[outputDFS.treeName.substring(0, outputDFS.treeName.length - 1)] = outputDFS.tree
        }
    })

    return {
        trees: trees,
        finished: f
    }
}
export function DFS(raw, root, colorOf, d, f, time, tree, treeName) {

    time = time + 1
    d[root] = time

    colorOf[root] = 1
    tree.push(root)
    treeName += root.toString() + '+'

    const children = raw.getAdjacencyList(root)

    children.forEach((child, i) => {
        if (colorOf[child] === 0){
            let outputDFS = DFS(raw, child, colorOf, d, f, time, tree, treeName)
            time = outputDFS.time
            treeName = outputDFS.treeName
        }
    })
    colorOf[root] = 2
    time = time + 1
    f[root] = time

    return {
        time: time,
        tree: tree,
        treeName: treeName
    }
}

// Turns the graph into its minimum spanning tree.
// @param {!Graph} graph: the graph to be transformed
// @param {string} s: the node label of the source node
// @returns {!Action[]} list of corresponding actions
export function minst(graph, s) {

    if (s === undefined) {
        s = Object.keys(graph.nodes)[0]
    }

    let actions = [new Action('minst', graph.nodes[s])]
    return prim(graph.getRawGraph(), graph, s, actions)

}

// Turns the graph into its maximum spanning tree.
// @param {!Graph} graph: the graph to be transformed
// @param {string} s: the node label of the source node
// @returns {!Action[]} list of corresponding actions
export function maxst(graph, s) {

    if (s === undefined) {
        s = Object.keys(graph.nodes)[0]
    }

    let raw = graph.getRawGraph()
    let actions = [new Action('maxst', graph.nodes[s])]
    for (let edge in raw.w) {
        raw.w[edge] = (1 / raw.w[edge])
    }
    return prim(raw, graph, s, actions)
}

// Turns the graph into a spanning tree as defined by Prim's algorithm
// @param {!RawGraph} raw: the raw graph data
// @param {!Graph} graph: the graph itself that will be turned into a tree
// @param {string} s: the node label of the source node
// @param {!Action[]} actions: the list of actions done before prim is called
// @returns {!Action[]} list of corresponding actions
export function prim(raw, graph, s, actions) {

    if (!graph.weighted) {
        throw 'cannot make a spanning tree for an unweighted graph.'
    }
    if (graph.directed) {
        throw 'cannot make a spanning tree for a directed graph.'
    }

    let queue = []
    let tree = []
    let parentOf = {}

    queue.unshift(s)
    parentOf[s] = s

    let temp = raw.clone()

    while (queue.length > 0) {
        let parent = queue.pop()
        tree.push(parent)
        let children = temp.getAdjacencyList(parent)
        children.forEach(child => {
            if (!parentOf.hasOwnProperty(child)) {
                parentOf[child] = parent
                queue.unshift(child)
            }
            temp.removeEdge(parent, child)
        })
    }

    let parent = {}
    let pq = new MinHeap()

    tree.forEach(node => {
        pq.insert(node)
        parent[node] = null
    })

    pq.decreaseKey(pq.indexOf(s), 0)

    while (!pq.isEmpty()) {

        let u = pq.extractMin()
        let adjU = raw.getAdjacencyList(u)

        if (adjU.length === 0) {
            break
        }

        adjU.forEach(v => {
            let w = raw.getWeight(u, v)
            let vind = pq.indexOf(v)
            if (vind !== -1 && w < pq.getKey(vind)) {
                pq.decreaseKey(vind, w)
                parent[v] = u
            }
        })
    }

    let remainingEdgeVisualKeys = []
    Object.entries(parent).forEach(([u2, v2]) => {
        if (v2 !== null) {
            remainingEdgeVisualKeys.push(u2 + ' ' + v2)
            remainingEdgeVisualKeys.push(v2 + ' ' + u2)
        }
    })

    tree.forEach(u => {
        raw.getAdjacencyList(u).forEach(v => {
            if (graph.hasEdge(u, v) && remainingEdgeVisualKeys.indexOf(u + ' ' + v) === -1) {
                actions.push(new Action('delete edge', graph.removeEdge(u, v)))
            }
        })
    })

    return actions
}
