// @fileoverview Main App component. 

/* eslint-disable */

import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import GraphTool from './graph-tool/components/graphtool.js'
import Home from './components/home/home.js'
import MenuBar from './components/menubar/menubar.js'
import Tutorial from './components/tutorial/tutorial.js'
import DevBlog from './components/devblog/devblog.js'

function App() {
    return (
            <Router>
                <MenuBar />
                <Route path={"/"} exact component={GraphTool} />
                <Route path={"/Graph-Library"} exact component={GraphTool} />
                <Route path="/Graph-Library/home" component={Home} />
                <Route path="/Graph-Library/devblog" component={DevBlog} />
                <Route path="/Graph-Library/tutorial" component={Tutorial} />
                <Route path="/Graph-Library/graph" component={GraphTool} />
            </Router>
    )
}

export default App
