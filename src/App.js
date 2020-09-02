// @fileoverview Main App component.

/* eslint-disable */

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import GraphTool from './graph-tool/components/graphtool.js'
import Home from './components/home/home.js'
import MenuBar from './components/menubar/menubar.js'
import Tutorial from './components/tutorial/tutorial.js'
import DevBlog from './components/devblog/devblog.js'
import Footer from './components/footer/footer.js'

function App() {
    return (
            <div>
                <MenuBar />
                <Route path="/home" component={Home} />
                <Route path="/devblog" component={DevBlog} />
                <Route path="/tutorial" component={Tutorial} />
                <Route path="/graph" component={GraphTool} />
                <Route path='*'>
                    <Redirect to='/graph' />
                </Route>
                <Footer />
            </div>
    )
}

export default App
