// @fileoverview React Component for the Share Section.

/* eslint-disable */

import React from 'react'
import './css/toolbar.css'

export class ShareSect extends React.Component {
    constructor(props) {
        super(props)
        this.fileInputRef = React.createRef()
    }

    getFile() {
        return this.fileInputRef.current.files[0]
    }

    render() {
        return (
            <div className = 'toolbar-sect' id = 'share-sect' key = 'share'>
                <div className = 'section-label'>Share</div>
                <div id = 'share-options-list'>
                    <button onClick={this.props.downloadPng}> download as png </button>
                    <div className = 'divider-line' />
                    <div>
                        <div>Download a sharable JSON version of your graph.</div>
                        <button onClick={this.props.downloadJSON}> export graph </button>
                    </div>
                    <div className = 'divider-line' />
                    <div>
                        <div> Import and load a graph. </div>
                        <button onClick={this.props.readInJSON}> load imported graph </button>
                        <input type='file'
                            ref={this.fileInputRef}
                            name='import'
                            accept='.json, .JSON'
                            className = 'custom-file-input' />
                    </div>
                </div>
            </div>
        )
    }
}
