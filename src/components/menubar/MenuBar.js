import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import './Menu.css'

export default class Home extends React.Component {
    render() {
        return (
            <div id = 'menubar'>
                <Link to="/home">Home</Link>
                <Link to="/tutorial">Tutorials</Link>
                <Link to="/graph">Graph</Link>
                <Link to="/devblog">Dev Blog</Link>
            </div>
        )
    }
}
