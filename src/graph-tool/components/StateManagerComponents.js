import React from 'react'
import './css/ToolBar.css'

export class StateManager extends React.Component {
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
                        <input type='checkbox' defaultChecked={true}
                            onClick={(cb) => {changeFunc('directed', cb.target.checked)}}
                            disabled={this.props.edgeCount > 0} />
                        <span>directed</span>
                    </div>
                    <div>
                        <input type='checkbox' onClick={(cb) => {changeFunc('weighted', cb.target.checked)}} />
                        <span>weighted</span>
                    </div>
                    <div>
                        <input type='checkbox'
                            onClick={(cb) => {changeFunc('simple', cb.target.checked)}}
                            defaultChecked={true}
                            disabled={true}/>
                        <span>simple</span>
                    </div>
                </div>
            </div>
        )
    }
}
