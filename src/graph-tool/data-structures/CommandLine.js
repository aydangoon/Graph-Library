// @fileoverview Object constructor for a Command Line Object.

/* eslint-disable */

import BoundedStack from './heaps-and-stacks/boundedstack.js'
import * as parser from '../functions/commandparsing.js'

// A Command Line is an object that handles much of the logic
// for a Command Line Interface. This includes command history
// and high level command parsing management.
export default function CommandLine() {

    // @private {string[]} A list of commands as strings.
    this.list = []

    // @private {!BoundedStack} A bounded stack storing the past 10 commands
    // as strings
    this.history = new BoundedStack()

    // Adds a list of commands to the list of current commands by joining the
    // strings together with "; " characters.
    // @params {string[]} cmds: A string list of commands typed in a single line.
    this.addCommand = (cmds) => {
        this.list.push(cmds.join('; ') + ';')
        this.history.clear()
    }

    // Removes the last command string from the list of commands and pushes it
    // to the history list.
    this.removeLastCommand = () => {
        if (this.list.length > 0) {
            this.history.push(this.list.pop())
        }
    }

    // Pops the last command string from the history stack and adds it to the
    // list of commands.
    this.addFromHistory = () => {
        if (!this.history.empty()) {
            this.list.push(this.history.pop())
        }
    }

    // Takes a command string and splits it into its parameters and does some
    // general parsing. This is then returned as an array of strings.
    // @param {string} cmd: the command string typed into the command line interface
    // @returns {string[]} the parsed array of parameters
    this.parseCommand = (cmd) => {

        let params = cmd.split(' ').filter(param => param !== '')
        if (params.length > 0) {
            switch(params[0]) {
                case 'bfs':
                case 'cc':
                case 'bipartite':
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
                case 'clearvis':
                    return params

                case 'del':
                    return parser.parseDel(params)

                case 'color':
                    return parser.parseColor(params)

                default:
                    return parser.parseAdd(params)

            }
        }
        return ['no command']
    }

    // Gives a copy of the list of commands.
    // @returns {string[]} list of command strings
    this.asList = () => {
        return [...this.list]
    }
}
