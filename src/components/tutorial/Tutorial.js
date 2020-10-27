// @fileoverview React Component for the Tutorial tab.

/* eslint-disable */

import React from 'react'
import './Tutorial.css'

export default class Tutorial extends React.Component {
    render() {
        return (
            <div className = 'container-sm p-2'>
                <div className = 'section d-flex flex-column align-items-center m-2'>
                    <div className = 'subtitle'> Adding, Moving and Deleting Edges and Nodes </div>
                    <div>
                        <iframe className = 'video'
                        src="https://www.youtube.com/embed/FatNwfX_AOs" allowFullScreen={true} title='tutorial 1' />
                    </div>
                </div>
                <div className = 'd-flex flex-column align-items-center m-2 section'>
                    <div className = 'subtitle'> Using the Command Line Interface </div>
                    <div>
                        <iframe className = 'video'
                        src="https://www.youtube.com/embed/v5xRNk93S0o" allowFullScreen={true} title='tutorial 2' />
                    </div>
                </div>
            </div>

        )
    }
}
