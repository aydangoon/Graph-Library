export function downloadPng(uri) {
    var element = document.createElement('a')
    element.setAttribute('href', uri)
    element.setAttribute('download', 'graph.png')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

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
