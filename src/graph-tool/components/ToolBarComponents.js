// @fileoverview React Component for the Graph Tool Bar as well as implementations
// for Tool Bar Sliders and Color Pickers.

/* eslint-disable */

import React from 'react'
import './css/toolbar.css'
import * as colors from '../assets/colors.js'

export class GraphToolBar extends React.Component {
    render() {
        const changeFunc = this.props.changeFunc
        const toolSettings = this.props.toolSettings
        return [
            <div className = 'toolbar-sect' key = 'nodeProps'>
                <div className = 'section-label'> Node Properties </div>
                <div className = 'toolbar-sect-content'>
                    <ToolBarSlider name={'radius'} settings={toolSettings} min={5} max={20}
                        setting={'nodeRadius'} changeFunc={changeFunc} />
                    <ToolBarColorPicker setting={'nodeColor'}
                        changeFunc={changeFunc} settings={toolSettings} />
                </div>
            </div>,
            <div className = 'toolbar-sect' key = 'edgeProps'>
                <div className = 'section-label'> Edge Properties </div>
                <div className = 'toolbar-sect-content'>
                    <ToolBarSlider name={'weight'} settings={toolSettings} min={-100} max={100}
                        setting={'weight'} changeFunc={changeFunc} />
                    <ToolBarColorPicker setting={'edgeColor'}
                        changeFunc={changeFunc} settings={toolSettings} />
                </div>
            </div>
        ]
    }
}

export class ToolBarSlider extends React.Component {
    constructor(props){
        super(props)
        this.inputRef = React.createRef()
        this.valueChange = this.valueChange.bind(this)
    }
    valueChange(e) {
        let rawStr = this.inputRef.current.value
        let num = parseInt(this.inputRef.current.value)
        if (rawStr.length > 0) {
            if (isNaN(num)) {
                this.inputRef.current.value = this.props.min
            } else {
                let paddedNum = Math.min(Math.max(this.props.min, num), this.props.max)
                this.props.changeFunc(this.props.setting, paddedNum)
            }
        }
    }
    render() {
        return (
            <div className = 'toolbar-slider'>
                <span>{this.props.name}:</span>
                <input type='number' title = {this.props.min + ' to ' + this.props.max}
                    min={this.props.min} max={this.props.max}
                    defaultValue={this.props.settings[this.props.setting]}
                    onInput={this.valueChange}
                    ref={this.inputRef} />
            </div>
        )
    }
}

export function ToolBarToggle(props) {
    const func = () => {
        props.changeFunc(props.setting, !props.settings[props.setting])
    }
    return (
        <div className = 'toolbar-toggle'>
            <label>
                Bent
                <input type='checkbox' defaultChecked={props.settings[props.setting]}
                    onInput={func} />
            </label>
        </div>
    )
}

export class ToolBarColorPicker extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            colors: [
                colors.BLACK,
                colors.DARK_VIOLET,
                colors.LIGHT_BLUE,
                colors.LIGHT_RED,
                colors.LIGHT_GREEN,
            ],
            selectedInd: 0
        }
    }

    changeColor(i) {
        this.props.changeFunc(this.props.setting, this.state.colors[i])
        this.setState({selectedInd: i})
    }

    render() {
        return (
            <div>
                <div className = 'color-preview-list'>
                    <div> color: </div>
                    {this.state.colors.map((item, index) => (
                        <div key = {index}
                            className = 'color-preview-elt'
                            style={{
                                backgroundColor: item,
                                border: index === this.state.selectedInd ? '2px solid white' : '1px solid var(--celadon-blue)'
                            }}
                            onClick={() => {this.changeColor(index)}} />
                    ))}
                </div>
            </div>
        )
    }
}
