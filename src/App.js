import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import GraphTool from './graph-tool/GraphTool.js'
import Home from './components/home/Home.js'
import MenuBar from './components/menubar/MenuBar.js'
import Tutorial from './components/tutorial/Tutorial.js'
import DevBlog from './components/devblog/DevBlog.js'

function App() {
    return (
            <Router>
                <MenuBar />
                <Route path="/" exact component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/devblog" component={DevBlog} />
                <Route path="/tutorial" component={Tutorial} />
                <Route path="/graph" component={GraphTool} />
            </Router>
    )
}

export default App
