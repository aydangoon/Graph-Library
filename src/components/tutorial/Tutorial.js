import React from 'react'
import './Tutorial.css'

export default class Tutorial extends React.Component {
    render() {
        return (
            <div id = 'tutorial'>
                <div className = 'section video-sect'>
                    <div className = 'subtitle'> Adding, Moving and Deleting Edges and Nodes </div>
                    <iframe width="420" height="315"
                    src="https://www.youtube.com/embed/FatNwfX_AOs" allowFullScreen={true}>
                    </iframe>
                </div>
                <div className = 'section video-sect'>
                    <div className = 'subtitle'> Using the Command Line Interface </div>
                    <iframe width="420" height="315"
                    src="https://www.youtube.com/embed/v5xRNk93S0o" allowFullScreen={true}>
                    </iframe>
                </div>
            </div>

        )
    }
}
