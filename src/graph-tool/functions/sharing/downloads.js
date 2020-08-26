// @fileoverview A collection of functions that transform the download information
// about the graph in a distinct specified file format.

/* eslint-disable */

// Downloads a PNG of the graph.
// @param {string} uri: the URI representation of the graph.
export function downloadPng(uri) {
    var element = document.createElement('a')
    element.setAttribute('href', uri)
    element.setAttribute('download', 'graph.png')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

// Downloads a JSON version of the graph.
// @param {JSON} the URI representation of the graph.
export function downloadJSON(json) {
    var element = document.createElement('a')
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json)
    element.setAttribute('href', dataStr)
    element.setAttribute('download', 'graph_data.JSON')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}
