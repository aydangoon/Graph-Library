// @fileoverview React Component for top navigation bar. Uses react router
// links to travel to different pages.

/* eslint-disable */

import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import './menu.css'

export default class Home extends React.Component {
    render() {
        return (
            <div id = 'menubar'>
                <Link to="/Graph-Library/home">Home</Link>
                <Link to="/Graph-Library/tutorial">Tutorials</Link>
                <Link to="/Graph-Library/graph">Graph</Link>
                <Link to="/Graph-Library/devblog">Dev Blog</Link>
            </div>
        )
    }
}
