// @fileoverview React Component for the State Manager. 

/* eslint-disable */

import React from 'react'
import { clearVisualizations } from '../functions/graphs/visualizations.js'
import './css/toolbar.css'

export class StateManager extends React.Component {

    clearVisualizations() {
        this.props.handleActions(clearVisualizations(this.props.graph), ['clearvis'])
    }
    render() {
        const clear = this.props.clearFunc
        const undo = this.props.undoFunc
        const redo = this.props.redoFunc
        const changeFunc = this.props.changeFunc
        return (
            <div className = 'toolbar-sect' id = 'state-manager'>
                <div className = 'section-label'> State </div>
                <div className = 'toolbar-sect-content'>
                    <div>
                        <button onClick={clear}> reset </button>
                        <button onClick={undo} disabled={!this.props.canUndo}> undo </button>
                        <button onClick={redo} disabled={!this.props.canRedo}> redo </button>
                    </div>
                    <div>
                        <button onClick={() => this.clearVisualizations()}>clear visualizations</button>
                    </div>
                    <div>
                        <input type='checkbox' defaultChecked={true}
                            onClick={(cb) => {changeFunc('directed', cb.target.checked)}}
                            disabled={this.props.edgeCount > 0} />
                        <span>directed</span>
                    </div>
                    <div>
                        <input type='checkbox' onClick={(cb) => {changeFunc('weighted', cb.target.checked)}} />
                        <span>weighted</span>
                    </div>
                    {/*<div>
                        <input type='checkbox'
                            onClick={(cb) => {changeFunc('simple', cb.target.checked)}}
                            defaultChecked={true}
                            disabled={true}/>
                        <span>simple</span>
                    </div>*/}
                </div>
            </div>
        )
    }
}
