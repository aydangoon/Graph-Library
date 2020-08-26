// @fileoverview Object constructor for a Raw Graph. The Raw Graph only has data fundamental
// to the implementation of a certain graph state, it is the **minimial implementation** of
// a graph in this entire application.
// TODO: there is inefficiency in this file and in graph. Fix them, them comment all the methods
// appropriately.

/* eslint-disable */

// The least abstracted graph data implementation in this entire application.
export default function RawGraph(directed = true, weighted = false, simple = true) {

    // @private {Object.<string, string[]>} The adjacency list of the graph.
    this.al = {}

    // @private {Object.<string, number>} A dictionary mapping edge keys to their weight.
    this.w = {}

    // @private {boolean} If the graph is directed or not.
    this.directed = directed

    // @private {boolean} If the graph is weighted or not.
    this.weighted = weighted

    // @private {boolean} If the graph is simple or not.
    this.simple = simple

    this.addNode = (n) => {
        this.al[n] = []
    }

    this.addEdge = (u, v, w) => {
        this.al[u].push(v)
        if (!this.directed) {
            this.al[v].push(u)
        }
        this.w[u + ' ' + v] = w
    }

    this.hasEdge = (u, v) => {
        let hasIt = false
        if (this.al.hasOwnProperty(u)) {
            hasIt = this.al[u].indexOf(v) !== -1
        } else if (!this.directed && this.al.hasOwnProperty(v)) {
            hasIt = this.al[v].indexOf(u) !== -1
        }
        return hasIt
    }

    this.hasNode = (n) => {
        return this.al.hasOwnProperty(n)
    }

    this.getAdjacencyList = (n) => {
        if (this.al.hasOwnProperty(n)) {
            return [...this.al[n]]
        }
        return []
    }

    this.getWeight = (u, v) => {
        if (!this.weighted) {
            return 1
        }
        let key = u + ' ' + v
        if (this.w.hasOwnProperty(key)) {
            return this.w[key]
        }
        key = v + ' ' + u
        if (!this.directed && this.w.hasOwnProperty(key)) {
            return this.w[key]
        }
        return 0
    }

    this.setWeight = (u, v, w) => {
        let key = u + ' ' + v
        if (this.w.hasOwnProperty(key)) {
            this.w[key] = w
            return this.w[key]
        }
        key = v + ' ' + u
        if (!this.directed && this.w.hasOwnProperty(key)) {
            this.w[key] = w
            return this.w[key]
        }
        return 0
    }
    this.increaseWeight = (u, v, w) => {
        this.setWeight(u, v, this.getWeight(u, v) + w)
    }

    this.getNodes = () => {
        return Object.keys(this.al)
    }

    this.getEdges = () => {
        let gc = this.clone()
        let edges = []
        gc.getNodes().forEach(node => {
            while (gc.al[node].length > 0) {
                edges.push([node, gc.al[node][0]])
                gc.removeEdge(node, gc.al[node][0])
            }
        })
        return edges
    }

    this.removeNode = (n) => {
        delete this.al[n]
    }

    this.completelyRemoveNode = (n) => {
        this.getAllEdgesIncidentOn(n).forEach(([u, v]) => {
            this.removeEdge(u, v)
        })
        this.removeNode(n)
    }

    this.removeEdge = (u, v) => {
        if (this.al.hasOwnProperty(u)) {
            this.al[u].splice(this.al[u].indexOf(v), 1)
            delete this.w[u + ' ' + v]
        }
        if (!this.directed && this.al.hasOwnProperty(v)) {
            this.al[v].splice(this.al[v].indexOf(u), 1)
            delete this.w[v + ' ' + u]
        }
    }

    this.getAllEdgesIncidentOn = (node) => {
        let edges = []
        for (let u in this.al) {
            if (u !== node && this.al[u].indexOf(node) !== -1) {
                edges.push([u, node])
            }
        }
        if (this.directed) {
            this.al[node].forEach(v => {
                edges.push([node, v])
            })
        }
        return edges
    }

    this.getUnderlyingGraph = () => {
        let ug = new RawGraph(false, this.weighted, this.simple)
        let nodes = Object.keys(this.al)
        nodes.forEach(node => {ug.addNode(node)})
        for (let u in this.al) {
            this.al[u].forEach(v => {
                if (!ug.hasEdge(u, v)) {
                    ug.addEdge(u, v)
                }
            })
        }
        return ug
    }

    this.getTranspose = () => {
        let gt = new RawGraph(this.directed, this.weighted, this.simple)
        let nodes = Object.keys(this.al)
        nodes.forEach(node => {gt.addNode(node)})
        for (let u in this.al) {
            this.al[u].forEach(v => {
                if (!gt.hasEdge(v, u)) {
                    gt.addEdge(v, u)
                }
            })
        }
        return gt
    }

    this.clone = () => {
        let gc = new RawGraph(this.directed, this.weighted)
        Object.keys(this.al).forEach(key => {
            gc.al[key] = [...this.al[key]]
        })
        Object.keys(this.w).forEach(key => {
            gc.w[key] = this.w[key]
        })
        return gc
    }

}
