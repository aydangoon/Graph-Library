export default function Action(priv, item = null) {
    this.privateString = priv
    this.publicString = makePublicString(priv, item)
    this.item = item
}

function makePublicString(priv, item) {
    if (item === null) {
        return priv
    }
    switch (priv) {
        case 'add node':
            return item.label
        case 'add edge':
            return item.u.label + ' ' + item.v.label
        case 'delete node':
            return 'del ' + item.label
        case 'delete edge':
            return 'del ' + item.u.label + ' ' + item.v.label
        case 'color node':
            return 'color ' + item.node.label + ' ' + item.colorLetter
        case 'color edge':
            return 'color ' + item.edge.u.label + ' ' + item.edge.v.label + ' ' + item.colorLetter
        case 'dijkstra':
            return 'dijkstra ' + item.s + ' ' + item.e
        case 'belford':
            return 'belford ' + item.s + ' ' + item.e
        case 'eulerian mark':
            return item.edge.u.label + ' to ' + item.edge.v.label
        case 'bfs':
            return 'bfs ' + item.label
        case 'minst':
            return 'minst ' + item.label
        case 'maxst':
            return 'maxst ' + item.label
        default:
            return priv
    }
}
