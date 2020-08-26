// @fileoverview A collection of graph functions that operate on raw graphs and output
// information about that graph. This can be how many connected components it has, if
// it is a tree, etc.

/* eslint-disable */

// Performs a run of kosaraju's algorithm on a raw graph.
// @param {!RawGraph} raw: the raw graph data to be used by the algorithm
// @returns {number} sccs: the number of strongly connected components the algorithm found
// @returns {boolean} dag: whether the graph is directed and acyclic or not
export function kosaraju(raw) {

    let f = exhaustiveDFS(raw).finished
    let transpose = raw.getTranspose()
    let nodes = Object.keys(f).map((key) => [key, f[key]]).sort((first, second) => second[1] - first[1]).map(keyValPair => keyValPair[0])

    let outputDFS = exhaustiveDFS(transpose, nodes)
    return {
        sccs: outputDFS.trees,
        dag: outputDFS.dag
    }
}

// Performs a DFS on all connected components in a raw graph.
// @param {!RawGraph} raw: the raw graph data to be used by the algorithm
// @param {string[]} nodes: the nodes in the graph, or component, to be used
// @returns {number} trees: the number of connected components found
// @returns {boolean} dag: whether the graph is directed and acyclic or not
// @ returns {Object<string, number>} finished: a dictionary connecting nodes to their
// finish time in the algorithm
// @ returns {Object<string, number>} discovered: a dictionary connecting nodes to their
// discovery time in the algorithm
export function exhaustiveDFS(raw, nodes = raw.getNodes()) {

    let dag = true
    let trees = 0

    const colorOf = {}
    const d = {}
    const f = {}

    let time = 0

    nodes.forEach(node => {colorOf[node] = 0})
    nodes.forEach(node => {
        if (colorOf[node] === 0) {
            let outputDFS = DFS(raw, node, colorOf, d, f, time)
            time = outputDFS.time
            dag = dag && !outputDFS.cycle
            trees++
        }
    })

    return {
        dag: dag.toString(),
        trees: trees,
        finished: f,
        discovered: d
    }
}

// Performs a DFS from a starting node.
// @param {!RawGraph} raw: the raw graph data to be used by the algorithm
// @param {string} root: the node to start the search on
// @param {Object<string, number>} colorOf: a dictionary connecting nodes to
// their appropriate color in the algorithm. 0: white, 1: grey, 2: black.
// @param {Object<string, number>} d: a dictionary connecting nodes to their
// discovery time in the algorithm
// @param {Object<string, number>} f: a dictionary connecting nodes to their
// finish time in the algorithm
// @param {number} time: the current time value in the algorithm run
// @returns {number} time: the finishing time of the algorithm
// @returns {boolean} cycle: indicates if a cycle was found
export function DFS(raw, root, colorOf, d, f, time) {

    let cycle = false
    time = time + 1
    d[root] = time
    colorOf[root] = 1

    raw.getAdjacencyList(root).forEach((child, i) => {
        if (colorOf[child] === 0){
            let outputDFS = DFS(raw, child, colorOf, d, f, time)
            time = outputDFS.time
            cycle = cycle || outputDFS.cycle
        } else if (colorOf[child] === 1) {
            cycle = true
        }
    })

    colorOf[root] = 2
    time = time + 1
    f[root] = time

    return {
        time: time,
        cycle: cycle
    }
}

// Performs a BFS from a starting node.
// @param {!RawGraph} raw: the raw graph data to be used by the algorithm
// @param {string} root: the root node to start the BFS from
// @param {Object<string, string>} A dictionary matching child nodes to their parent nodes
// @returns {boolean} cycle: indicates if a cycle was found
// @returns {boolean} bipartite: if the graph is bipartite or not
// @returns {number} nodeCount: the number of nodes counted by the algorithm
function BFS(raw, root, parentOf = {}) {

    let cycle = false
    let bipartite = true

    let depthLevel = {}
    let queue = []
    let nodeCount = 0
    queue.unshift(root)

    parentOf[root] = root
    depthLevel[root] = 0

    while (queue.length > 0) {

        let parent = queue.pop()
        nodeCount++

        raw.getAdjacencyList(parent).forEach(child => {
            if (parentOf[child] != null) {
                if (parentOf[parent] !== child) {
                    cycle = true
                    bipartite = bipartite && ((depthLevel[parent] - depthLevel[child]) % 2 !== 0)
                }
            } else {
                parentOf[child] = parent
                depthLevel[child] = depthLevel[parent] + 1
                queue.unshift(child)
            }
        })
    }

    return {
        cycle: cycle,
        bipartite: bipartite,
        nodeCount: nodeCount
    }
}

// Performs a BFS on every connected component in a graph.
// @param {!RawGraph} raw: the raw graph data to be used by the algorithm
// @returns {integer} ccs: number of connected components
// @returns {integer} nonSingletons: number of connected components with more than
// one node
// @returns {string} acyclic: string representation of boolean for whether the
// graph is acyclic
// @returns {string} tree: string representation of boolean for whether the graph
// is a tree
// @returns {string} forest: string representation of boolean for whether the
// graph is a forest
// @returns {string} bipartite: string representation of boolean for whether the
// cc is bipartite
export function exhaustiveBFS(raw) {

    let ccs = 0
    let nonSingletons = 0
    let cycle = false
    let nodes = raw.getNodes()
    let bipartite = nodes.length > 0
    let parentOf = {}
    nodes.forEach(node => {parentOf[node] = null})

    while (nodes.length > 0) {
        let root = nodes.pop()
        if (parentOf[root] == null) {
            ccs++
            let outputBFS = BFS(raw, root, parentOf)
            cycle = cycle || outputBFS.cycle
            bipartite = bipartite && outputBFS.bipartite
            if (outputBFS.nodeCount > 1) {
                nonSingletons++
            }
        }
    }
    return {
        ccs: ccs,
        nonSingletons: nonSingletons,
        acyclic: (!cycle).toString(),
        tree: (ccs === 1 && !cycle).toString(),
        forest: (ccs >= 0 && !cycle).toString(),
        bipartite: bipartite.toString()
    }
}

// Determines whether the graph is eulerian and/or hamiltonian.
// @param {number} ccs: Number of connected components in graph
// @param {number} nonSingletons: number of non-singleton connected components in graph
// @param {!RawGraph} raw: the raw graph data to be used by the algorithm
// @returns {string} eulerian: string representation of boolean for whether the
// graph is eulerian or not
// @returns {number} minDegree: the minimum degree in the graph
// @returns {number} maxDegree: the maximum degree in the graph
// @returns {string} hamStr: the string output for whether the graph is hamiltonian
// or not. This can be "True", "False", or "Possible".
export function eulerianAndHamiltonian(ccs, nonSingletons, raw) {

    let nodes = raw.getNodes()

    let maxDegree = 0
    let minDegree = raw.getNodes().length
    let eulerian = true && nonSingletons === 1

    let hamiltonian = (ccs > 1) ? 0 : 2 // 0: false, 1: possible, 2: true
    const hamDeg = nodes.length * 0.5

    nodes.forEach(node => {
        let childCount = raw.getAdjacencyList(node).length
        if (childCount % 2 === 1) {
            eulerian = false
        }
        if (hamiltonian === 2 && childCount < hamDeg) {
            hamiltonian = 1
        }
        if (childCount > maxDegree) {
            maxDegree = childCount
        }
        if (childCount < minDegree){
            minDegree = childCount
        }
    })

    if (hamiltonian === 2 && nodes.length < 3) {
        hamiltonian = 1
    }

    let hamStr
    switch (hamiltonian) {
        case 0:
            hamStr = 'false'
            break

        case 1:
            hamStr = 'possible'
            break

        default:
            hamStr = 'true'
            break
    }

    return {
        eulerian: eulerian.toString(),
        minDegree: minDegree,
        maxDegree: maxDegree,
        hamiltonian: hamStr
    }
}
