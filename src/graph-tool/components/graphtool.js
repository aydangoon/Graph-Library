// @fileoverview React Component for the parent Graph Tool. This contains all UI
// children. These children are GraphToolBar, GraphRender, GraphPropsList, CLI,
// CommandList, and ShareSect. Top level state is stored in this react component,
// and this included the actual graph itself.

/* eslint-disable */

import React from 'react'
import { GraphToolBar } from './ToolBarComponents.js'
import { GraphRender } from './RenderingComponents.js'
import { GraphPropsList } from './GraphProps.js'
import { StateManager } from './StateManagerComponents.js'
import { CLI } from './CommandLineInterface.js'
import { CommandList } from './CommandList.js'
import { ShareSect } from './sharecomponents.js'
import Graph from '../data-structures/graphs/graph.js'
import BoundedStack from '../data-structures/heaps-and-stacks/boundedstack.js'
import CommandLine from '../data-structures/CommandLine.js'
import * as downloads from '../functions/sharing/downloads.js'
import * as colors from '../assets/Colors.js'
import './css/graphtool.css'
import parseJSONInput from '../functions/sharing/jsonparser.js'
import { redoToGraph, undoToGraph } from '../functions/graphs/StateManagement.js'

export default class GraphTool extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            // tool settings represents node/edge state as they are added
            toolSettings: {

                // nodes
                nodeRadius: 10,
                nodeColor: colors.BLACK,

                // edges
                weight: 1,
                edgeColor: colors.BLACK

            },

            undoStack: new BoundedStack(),
            redoStack: new BoundedStack(),
            commandLine: new CommandLine(),

            // real graph data
            graph: new Graph()

        }
        this.changeToolSetting      = this.changeToolSetting.bind(this)
        this.changeGraphSetting     = this.changeGraphSetting.bind(this)
        this.handleActions          = this.handleActions.bind(this)
        this.downloadPng            = this.downloadPng.bind(this)
        this.downloadJSON           = this.downloadJSON.bind(this)
        this.readInJSON             = this.readInJSON.bind(this)
        this.clear                  = this.clear.bind(this)
        this.undo                   = this.undo.bind(this)
        this.redo                   = this.redo.bind(this)
        this.renderingRef           = React.createRef()
        this.shareSectRef           = React.createRef()
    }

    downloadPng() {
        downloads.downloadPng(this.renderingRef.current.getPngURI())
    }

    downloadJSON() {
        downloads.downloadJSON(JSON.stringify(this.state.graph))
    }

    readInJSON() {
        let file = (this.shareSectRef.current.getFile())
        if (file === undefined) {
            return
        }
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => { this.makeGraph(JSON.parse(reader.result))}
    }

    makeGraph(fgraph) {
        try {
            let tgraph = parseJSONInput(fgraph)
            this.setState({
                graph: tgraph,
                undoStack: new BoundedStack(),
                redoStack: new BoundedStack(),
                commandLine: new CommandLine()
            })
        } catch (err) { alert('JSON Parsing Error: ' + err) }
    }

    changeToolSetting(setting, value) {
        let toolSettings = this.state.toolSettings
        toolSettings[setting] = value
        this.forceUpdate()
    }

    changeGraphSetting(setting, value) {
        let graph = this.state.graph
        graph.changeProp(setting, value)
        if (setting === 'directed') {
            this.state.redoStack.clear()
            this.state.undoStack.clear()
        }
        this.forceUpdate()
    }

    clear(){
        this.setState({
            graph: new Graph(this.state.graph.directed, this.state.graph.weighted),
            undoStack: new BoundedStack(),
            redoStack: new BoundedStack(),
            commandLine: new CommandLine()
        })
    }

    handleActions(actions, cmdList) {
        if (actions.length === 0) {
            return
        }
        this.state.undoStack.push(actions)
        this.state.commandLine.addCommand(cmdList)
        this.setState({redoStack: new BoundedStack()})
    }

    redoActions(actions) {
        actions.forEach(action => {
            if (Array.isArray(action)) {
                this.redoActions(action)
            } else {
                redoToGraph(action, this.state.graph)
            }
        })
    }

    redo() {
        let lastActions = this.state.redoStack.pop()
        this.redoActions(lastActions)
        this.state.undoStack.push(lastActions)
        this.state.commandLine.addFromHistory()
        this.forceUpdate()
    }

    undoActions(actions) {
        for (let i = actions.length - 1; i >= 0; i--) {
            let action = actions[i]
            if (Array.isArray(action)) {
                this.undoActions(action)
            } else {
                undoToGraph(action, this.state.graph)
            }
        }
    }

    undo() {
        let lastActions = this.state.undoStack.pop()
        this.undoActions(lastActions)
        this.state.redoStack.push(lastActions)
        this.state.commandLine.removeLastCommand()
        this.forceUpdate()
    }

    render() {

        //console.log('__________________________')
        //console.log(this.state.graph.directed)
        //console.log(this.state.graph.edges)
        //console.log(this.state.graph.raw.al)

        return (
            <div id = 'graph-tool-wrapper'>
                <div id = 'rendering-and-commands'>
                    <GraphRender
                        ref={this.renderingRef}
                        graph={this.state.graph}
                        style={this.state.toolSettings}
                        handleActions={this.handleActions}
                    />
                    <div id = 'command-items' className = 'spaced'>
                        <CommandList />
                        <CLI clState={this.state.commandLine}
                            graph={this.state.graph}
                            style={this.state.toolSettings}
                            handleActions={this.handleActions}
                        />
                    </div>
                </div>
                <div id = 'tool-bar-and-props'>
                    <div id = 'tool-bar' className = 'section spaced'>
                        <div className = 'section-label'> Tool Bar </div>
                        <div id = 'tool-bar-content'>
                            <GraphToolBar
                                toolSettings={this.state.toolSettings}
                                changeFunc={this.changeToolSetting} />
                            <StateManager
                                handleActions={this.handleActions}
                                graph={this.state.graph}
                                clearFunc={this.clear}
                                undoFunc={this.undo}
                                redoFunc={this.redo}
                                canRedo={!this.state.redoStack.empty()}
                                canUndo={!this.state.undoStack.empty()}
                                edgeCount={this.state.graph.getEdgeVisuals().length}
                                changeFunc={this.changeGraphSetting}/>
                            <ShareSect
                                ref={this.shareSectRef}
                                downloadPng={this.downloadPng}
                                downloadJSON={this.downloadJSON}
                                readInJSON={this.readInJSON}/>
                        </div>
                    </div>
                    <GraphPropsList graph = {this.state.graph.getRawGraph()} />
                </div>
            </div>
        )
    }
}
