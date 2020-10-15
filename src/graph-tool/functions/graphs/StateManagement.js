export function redoToGraph(action, graph) {
    const name = action.name
    const item = action.item
    let curr, node, edge
    switch (name) {
        case 'add node':
            graph.addNode(item)
            break

        case 'delete node':
            graph.removeNode(item)
            break

        case 'add edge':
            graph.addEdge(item)
            break

        case 'delete edge':
            graph.removeEdge(item)
            break

        case 'color node':
            curr = item.curr
            node = item.node
            node.color = curr
            break

        case 'color edge':
            curr = item.curr
            edge = item.edge
            edge.color = curr
            break

        case 'eulerian mark':
            item.edge.eulerianMarker = item.mark
            break

        case 'set weight':
            graph.setWeight(item.u, item.v, item.nw)
            break
    }
}

export function undoToGraph(action, graph) {
    const name = action.name
    const item = action.item
    let prev, edge, node
    switch (name) {
        case 'add node':
            graph.removeNode(item)
            break

        case 'delete node':
            graph.addNode(item)
            break

        case 'add edge':
            graph.removeEdge(item)
            break

        case 'delete edge':
            graph.addEdge(item)
            break

        case 'color node':
            prev = item.prev
            node = item.node
            node.color = prev
            break

        case 'color edge':
            prev = item.prev
            edge = item.edge
            edge.color = prev
            break

        case 'eulerian mark':
            item.edge.eulerianMarker = item.prev
            break

        case 'set weight':
            graph.setWeight(item.u, item.v, item.pw)
            break
    }
}
