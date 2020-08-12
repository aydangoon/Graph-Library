import BoundedStack from './BoundedStack.js'
import * as Parser from '../functions/CommandParsing.js'

export default function CommandLine() {

    this.list = []
    this.history = new BoundedStack()
    //this.reg = new RegExp('[^A-Za-z0-9]+', 'g')

    this.addCommand = (cmds) => {
        this.list.push(cmds.join('; ') + ';')
        this.history.clear()
    }

    this.removeLastCommand = () => {
        if (this.list.length > 0) {
            this.history.push(this.list.pop())
        }
    }

    this.addFromHistory = () => {
        if (!this.history.empty()) {
            this.list.push(this.history.pop())
        }
    }

    this.parseCommand = (cmd) => {

        let params = cmd.split(' ').filter(param => param !== '')
        if (params.length > 0) {
            switch(params[0]) {
                case 'bfs':
                case 'cc':
                case 'colorall':
                case 'trans':
                case 'clear':
                case 'kosaraju':
                case 'maxst':
                case 'minst':
                case 'dijkstra':
                case 'belford':
                case 'comp':
                case 'eulcirc':
                case 'eulpat':
                case 'stowag':
                    return params
                case 'del':
                    return Parser.parseDel(params)
                case 'color':
                    return Parser.parseColor(params)
                default:
                    return Parser.parseAdd(params)
            }
        }
        return ['no command']
    }

    this.asList = () => {
        return [...this.list]
    }
}
