// @fileoverview Root Javascript entry point.

/* eslint-disable */
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import App from './app.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery'
import Popper from 'poppers.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import './index.scss'

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
)
