// @fileoverview React Component for the Graph Properties List. Note, the graph properties
// are also calculated in this file by calls to functions imported from graphing.js

/* eslint-disable */

import React from 'react'
import './css/PropList.css'
import { exhaustiveBFS, kosaraju, eulerianAndHamiltonian } from '../functions/graphs/graphing.js'
import * as colors from '../assets/Colors.js'

export class GraphPropsList extends React.Component {

    render(){

        let underlyingGraph = this.props.graph.getUnderlyingGraph()
        let outputBFS = exhaustiveBFS(underlyingGraph)
        let propsOutput

        if (!this.props.graph.directed) {
            let outputEul = eulerianAndHamiltonian(outputBFS.ccs, outputBFS.nonSingletons, underlyingGraph)
            propsOutput = [
                GraphProp('Min Degree', outputEul.minDegree),
                GraphProp('Max Degree', outputEul.maxDegree),
                GraphProp('Tree', outputBFS.tree),
                GraphProp('Forest', outputBFS.forest),
                GraphProp('Eulerian', outputEul.eulerian),
                GraphProp('Hamiltonian', outputEul.hamiltonian)
            ]
        } else {
            let outputKos = kosaraju(this.props.graph)
            propsOutput = [
                GraphProp('Polytree', outputBFS.tree),
                GraphProp('Polyforest', outputBFS.forest),
                GraphProp('DAG', outputKos.dag),
                GraphProp('Strongly Connected Components', outputKos.sccs)
            ]
        }

        return (
            <div id = 'props' className = 'section spaced'>
                <div className = 'section-label'> Graph Properties </div>
                <div id = 'props-list'>
                    {GraphProp('Connected Components', outputBFS.ccs)}
                    {propsOutput}
                    {GraphProp('Bipartite', outputBFS.bipartite)}
                </div>
            </div>
        )
    }
}

function GraphProp(string, item) {
    let style = {}
    let color = 0 //0 blue, 1 red, 2 violet
    switch(typeof item) {
        case 'boolean':
            if (!item) {
                color = 1
            }
            break
        case 'number':
            if (item === 0) {
                color = 1
            }
            break
        case 'string':
            if (item === 'possible') {
                color = 2
            } else if (item === 'false') {
                color = 1
            }
            break
        default:
            break
    }
    switch(color) {
        case 0:
            style.backgroundColor = colors.CELESTE
            style.color = colors.CELADON_BLUE
            break
        case 1:
            style.backgroundColor = colors.LIGHT_RED
            style.color = colors.DEEP_RED_2
            break
        case 2:
            style.backgroundColor = colors.LIGHT_VIOLET
            style.color = colors.PURPLE
            break
        default:
            break
    }
    return <div key={string} style={style}> {string}: {item} </div>
}
