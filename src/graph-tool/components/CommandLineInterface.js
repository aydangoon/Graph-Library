/* eslint-disable */
import React from 'react'
import * as Transformations from '../functions/Transformations.js'
import * as Visualizations from '../functions/Visualizations.js'
//import { hamiltionianCycle } from '../data-structures/Hamiltonian.js'
import Action from '../data-structures/Action.js'
import * as Colors from '../assets/Colors.js'
import './css/CommandLineInterface.css'

export class CLI extends React.Component {

    constructor(props) {
        super(props)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.inputRef = React.createRef()
        this.bottomRef = React.createRef()
        this.state = {
            status: 'None',
            error: false
        }
    }

    handleKeyPress(e) {
        if (e.keyCode === 13) {
            this.handleCommand(this.inputRef.current.value)
            this.inputRef.current.value = ''
        }
    }

    handleCommand(line) {
        const graph = this.props.graph
        const style = this.props.style
        const cl = this.props.clState
        let cmdList
        if (line.includes(';')) {
            cmdList = line.split(';').filter(cmd => cmd !== '')
        } else {
            cmdList = [line]
        }
        let actions = []
        cmdList.forEach(cmd => {

            let pc = cl.parseCommand(cmd)
            let u, v, src
            try {
                switch (pc[0]) {
                    case 'delete node':
                        actions.push(Transformations.deleteNode(graph, pc[1]))
                    break
                    case 'add edge':
                        u = pc[1]
                        v = pc[2]
                        let w = pc[3]
                        if (u === v) {
                            throw 'no self edges.'
                        }
                        if (graph.hasNode(u) && graph.hasNode(v)) {
                            if (graph.hasEdge(u, v)) {
                                if (w === undefined) {
                                    throw 'edge already exists.'
                                }
                                graph.setWeight(u, v, w)
                            }
                            actions.push(new Action('add edge', graph.addEdge(u, v, style, w)))
                        } else {
                            throw 'no such nodes.'
                        }
                    break
                    case 'delete edge':
                        u = pc[1]
                        v = pc[2]
                        if (graph.hasEdge(u, v)) {
                            actions.push(new Action('delete edge', graph.removeEdge(u, v)))
                        } else {
                            throw 'edge does not exist.'
                        }
                    break
                    case 'add node':
                        if (graph.nodeCount === 30) {
                            throw 'node limit reached.'
                        }
                        if (!graph.hasNode(pc[1])) {
                            actions.push(new Action('add node', graph.addNode(pc[1], style)))
                        } else {
                            throw 'node already exists.'
                        }
                    break
                    case 'bfs':
                        let node = pc.length === 1 ? null : pc[1]
                        actions.push(Transformations.BFS(graph, node))
                    break
                    case 'cc':
                        let nodes = pc.length === 1 ? null : pc.splice(1)
                        actions.push(Transformations.completelyConnected(graph, style, nodes))
                    break
                    case 'color node':
                        actions.push(Visualizations.color(graph, pc[1], pc[2]))
                    break
                    case 'color edge':
                        actions.push(Visualizations.color(graph, [pc[1], pc[2]], pc[3], false))
                    break
                    /*
                    case 'bipartite':
                        actions.push(Visualizations.colorAll(graph))
                    break;
                    */
                    case 'trans':
                        actions.push(Transformations.transpose(graph, style))
                    break
                    case 'clear':
                        actions.push(Transformations.clear(graph))
                    break
                    case 'kosaraju':
                        actions.push(Transformations.kosaraju(graph, style))
                    break
                    case 'minst':
                        src = pc[1]
                        actions.push(Transformations.minst(graph, src))
                    break
                    case 'maxst':
                        src = pc[1]
                        actions.push(Transformations.maxst(graph, src))
                    break
                    case 'dijkstra':
                        actions.push(Visualizations.dijkstra(graph, pc[1], pc[2]))
                    break
                    case 'belford':
                        actions.push(Visualizations.bellmanFord(graph, pc[1], pc[2]))
                    break
                    case 'comp':
                        actions.push(Transformations.complement(graph, style))
                    break
                    case 'eulcirc':
                        actions.push(Visualizations.eulerianCircuit(graph))
                    break
                    case 'eulpat':
                        actions.push(Visualizations.eulerianPath(graph))
                    break
                    case 'stowag':
                        actions.push(Visualizations.stoerWagner(graph))
                    break
                    default:
                        throw 'no command or bad command parse.'
                }
                this.setState({status: 'Good.', error: false})
            } catch (err) {
                this.setState({status: 'Bad, ' + err, error: true})
            }
        })
        this.props.handleActions(actions, cmdList)
    }

    render() {

        const lineArr = this.props.clState.asList()
        const style = !this.state.error ? {backgroundColor: Colors.CELESTE, color: Colors.CELADON_BLUE}
                                        : {backgroundColor: Colors.LIGHT_RED, color: Colors.DEEP_RED_2}

        return (
            <div id = 'command-line-interface' className = 'section' key = 'cli'>
                <div className = 'section-label'> Command Line Interface </div>
                <div id='cli-status-wrapper' style={style}> Command Status: {this.state.status}</div>
                <div id = 'command-line-output'>
                    {lineArr.map((item, index) => (
                        <div key={index}>{item}</div>
                    ))}
                    <div ref={this.bottomRef}/>
                </div>
                <div id = 'input-line-wrapper' onKeyDown={this.handleKeyPress}>
                    <input id = 'cursor' ref = {this.inputRef} placeholder='commands here'/>
                </div>
            </div>
        )
    }

    scrollToBottom() {
        this.bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }

    componentDidMount() {
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

}
