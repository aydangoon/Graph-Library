// @fileoverview React Component for the Tutorial tab.

/* eslint-disable */

import React from 'react'
import './tutorial.css'

export default class Tutorial extends React.Component {
    render() {
        return (
            <div id = 'tutorial'>
                <div className = 'section video-sect'>
                    <div className = 'subtitle'> Adding, Moving and Deleting Edges and Nodes </div>
                    <iframe className = 'video'
                    src="https://www.youtube.com/embed/FatNwfX_AOs" allowFullScreen={true} title='tutorial 1'>
                    </iframe>
                </div>
                <div className = 'section video-sect'>
                    <div className = 'subtitle'> Using the Command Line Interface </div>
                    <iframe className = 'video'
                    src="https://www.youtube.com/embed/v5xRNk93S0o" allowFullScreen={true} title='tutorial 2'>
                    </iframe>
                </div>
            </div>

        )
    }
}
