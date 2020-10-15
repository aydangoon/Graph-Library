// @fileoverview Main App component.

/* eslint-disable */

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import GraphTool from './graph-tool/components/graphtool.js'
import Home from './components/home/Home.js'
import MenuBar from './components/menubar/MenuBar.js'
import Tutorial from './components/tutorial/Tutorial.js'
import DevBlog from './components/devblog/DevBlog.js'
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
