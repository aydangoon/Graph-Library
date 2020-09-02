// @fileoverview React Component for top navigation bar. Uses react router
// links to travel to different pages.

/* eslint-disable */

import React from 'react'
import { NavLink } from 'react-router-dom'
import './menu.css'

export default class Home extends React.Component {
    render() {
        return (
            <div className = 'navbar navbar-expand-sm shadow'>
                <div class="navbar-brand mb-0 h1">
                    <img src={require('../../assets/logo.png')} width='100'/>
                </div>
                <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#collapsedBar" aria-controls="collapsedBar" aria-expanded="false" aria-label="Toggle navigation">
                    <img src={require('../../assets/hamburger.png')} alt='' width={25}/>
                </button>
                <div className = 'collapse navbar-collapse' id = 'collapsedBar'>
                    <ul className="navbar-nav">
                        <li className="navbar-text m-2">
                            <NavLink to="/home">Home</NavLink>
                        </li>
                        <li className="navbar-text m-2">
                            <NavLink to="/tutorial">Tutorials</NavLink>
                        </li>
                        <li className="navbar-text m-2">
                            <NavLink to="/graph">Graph</NavLink>
                        </li>
                        <li className="navbar-text m-2">
                            <NavLink to="/devblog">Dev Blog</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
