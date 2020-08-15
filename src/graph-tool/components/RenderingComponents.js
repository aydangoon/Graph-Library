/* eslint-disable */
import React from 'react'
import Action from '../data-structures/Action.js'
import * as Gmy from '../functions/Geometry.js'
import * as Transformations from '../functions/Transformations.js'
import * as Renderer from '../functions/Rendering.js'
import * as Colors from '../assets/Colors.js'

export class GraphRender extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedNode: null,
            selectedEdges: [],
            mouseDown: false,
        }
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseDown = this.mouseDown.bind(this)
        this.mouseMove = this.mouseMove.bind(this)
        this.renderGraph = this.renderGraph.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.canvasRef = React.createRef()
    }

    getPngURI() {
        return this.canvasRef.current.toDataURL()
    }

    nodeClicked(x, y, dims) {
        const nodes = this.props.graph.getNodeVisuals()
        let node
        for (let i = 0; i < nodes.length; i++) {
            node = nodes[i]
            if (Gmy.dist({x, y}, Gmy.toScale(node, dims)) <= node.radius) {
                return node
            }
        }
        return null
    }

    edgeClicked(x, y, dims) {
        const edges = this.props.graph.getEdgeVisuals()
        for (let i = 0; i < edges.length; i++) {
            if (Gmy.edgeClicked(x, y, edges[i], dims)) {
                return edges[i]
            }
        }
        return null
    }

    manageEdgeSelection(edge) {
        let se = this.state.selectedEdges
        if (se.indexOf(edge) === -1) {
            se.push(edge)
        } else {
            se.splice(se.indexOf(edge), 1)
        }
    }

    mouseDown(e) {

        const dims = this.getCanvasDimensions()
        const {x, y} = this.getMouseInput(e)
        const mm = Gmy.toMinmap({x, y}, dims)
        const graph = this.props.graph
        const style = this.props.style
        const clickedNode = this.nodeClicked(x, y, dims)
        const clickedEdge = this.edgeClicked(x, y, dims)
        const nodeClicked = clickedNode !== null
        const nodeSelected = this.state.selectedNode !== null
        const edgeClicked = clickedEdge !== null

        if (!nodeSelected && nodeClicked) {

            this.setState({selectedNode: clickedNode})

        } else if (edgeClicked) {

            this.manageEdgeSelection(clickedEdge)

        } else if (!nodeSelected && !nodeClicked && graph.nodeCount < 30) {

            let label = graph.getNextNodeLabel()
            let nodeToAdd = graph.addNode(label, style, mm.x, mm.y)
            this.props.handleActions([new Action('add node', nodeToAdd)], [label])

        } else if (nodeSelected && !nodeClicked) {

            this.state.selectedNode.x = mm.x
            this.state.selectedNode.y = mm.y
            this.setState({selectedNode: null})

        } else if (nodeSelected && nodeClicked) {

            let u = this.state.selectedNode.label
            let v = clickedNode.label

            if (!graph.hasEdge(u, v) && u !== v) {

                let edge = graph.addEdge(this.state.selectedNode.label, clickedNode.label, style)
                this.props.handleActions([new Action('add edge', edge)], [edge.u.label + ' ' + edge.v.label])
                this.setState({selectedNode: null})

            }

        }
        this.setState({mouseDown: true})
    }

    mouseUp(e) {
        if (this.state.movingNode) {
            this.setState({selectedNode: null, movingNode: false})
        }
        this.setState({mouseDown: false})
    }

    mouseMove(e) {
        if (this.state.selectedNode !== null && this.state.mouseDown) {
            const {x, y} = this.getMouseInput(e)
            const {w, h} = this.getCanvasDimensions()
            this.state.selectedNode.x = x / w
            this.state.selectedNode.y = y / h
            this.setState({movingNode: true})
        }
    }

    handleKeyPress(e) {
        switch (e.keyCode) {
            case 8:
                let actions = []
                let cmds = []
                if (this.state.selectedNode != null) {
                    e.preventDefault()
                    actions.push(Transformations.deleteNode(this.props.graph, this.state.selectedNode.label))
                    cmds.push('del ' + this.state.selectedNode.label)
                    this.setState({selectedNode: null})
                }
                if (this.state.selectedEdges.length > 0) {
                    e.preventDefault()
                    this.state.selectedEdges.forEach(edge => {
                        if (this.props.graph.hasEdge(edge)) {
                            actions.push(new Action('delete edge', this.props.graph.removeEdge(edge)))
                            cmds.push('del ' + edge.u.label + ' ' + edge.v.label)
                        }
                    })
                    this.setState({selectedEdges: []})
                }
                this.props.handleActions(actions, cmds)
            break
            case 27:
                this.setState({
                    selectedNode: null,
                    selectedEdges: []
                })
            break
        }
    }

    getMouseInput(e) {
        const canvas = this.canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left)
        const y = (e.clientY - rect.top)
        return {x, y}
    }

    render() {
        return (
            <canvas id = 'canvas' className = 'section spaced' ref={this.canvasRef}
                onMouseUp={this.mouseUp}
                onMouseDown={this.mouseDown}
                onMouseMove={this.mouseMove}/>
        )
    }

    componentDidUpdate() {
        this.renderGraph()
    }

    componentDidMount(){
        document.addEventListener('keydown', this.handleKeyPress, false)
        window.addEventListener('resize', this.renderGraph)
        this.fixCanvasDimensions()
    }
    componentWillUnmount(){
        document.removeEventListener('keydown', this.handleKeyPress, false)
        window.removeEventListener('resize', this.renderGraph)
    }

    getCanvasDimensions() {
        return {w: this.canvasRef.current.width, h: this.canvasRef.current.height}
    }

    fixCanvasDimensions() {
        const canvas = this.canvasRef.current
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
    }

    renderGraph() {

        this.fixCanvasDimensions()

        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")
        const graph = this.props.graph
        const style = this.props.style
        const nodes = graph.getNodeVisuals()
        const edges = graph.getEdgeVisuals()

        Renderer.clearAndPrepare(ctx)

        const selectedNode = this.state.selectedNode
        if (selectedNode !== null && !graph.hasNode(selectedNode)) {
            this.setState({selectedNode: null})
        }

        const selectedEdges = this.state.selectedEdges
        edges.forEach(edge => {
            Renderer.drawEdge(ctx, canvas, edge, edge.color, graph.directed, edge.bent, graph.weighted, selectedEdges.indexOf(edge) !== -1)
        })

        nodes.forEach(node => {
            if (node === selectedNode) {
                Renderer.fillCircle(ctx, canvas, node.x, node.y,
                    1.2 * node.radius, Colors.HIGHLIGHT, false)
            }
            Renderer.fillCircle(ctx, canvas, node.x, node.y, node.radius, node.color, true)
            Renderer.fillText(ctx, canvas, node.label, node.x, node.y, 'white', node.radius < 10 ? 10 : 12)
        })
    }
}
