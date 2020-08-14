import React from 'react'
import './css/CommandList.css'

function Command(name, desc, constraints = []) {
    return (
        <div className = 'command-list-item'>
            <div className = 'section-label'> {name} </div>
            <p> {desc} </p>
            <div id = 'constraint-list'>
                {constraints.map((item, index) => (
                    <div key={index} className = 'constraint'> {item}</div>
                ))}
            </div>
        </div>
    )
}

export class CommandList extends React.Component {
    render() {
        return (
            <div id = 'command-list' className = 'section' key = 'cl'>
                <div className = 'section-label'> Command List </div>
                <div>• A command may have a name and a list of arguments separated by spaces. </div>
                <div>• Necessary arguments are denoted with brackets [ ] and optional arguments with curly braces {'{ }'}. </div>
                <div>• In the Command Line Interface, do not actually include brackets or braces with arguments. </div>
                {Command('name [necessary argument] {optional argument}', 'This is a sample command.', ['graph requirements'])}
                <div className = 'divider-line' />
                <div>
                    {Command('[u]', 'Creates a new node labeled u.')}
                    {Command('[u] [v] {w}', 'Creates a new edge from nodes u to v. You may optionally specify a weight, w. If the edge exists, the weight is updated to w.')}
                    {Command('del [u]', 'Deletes node u.')}
                    {Command('del [u] [v]', 'Deletes edge from nodes u to v.')}
                    {Command('cc {u} {v} {w} . . .', 'If no arguments are specified then the command completely connects the graph. Otherwise only the specified nodes become completely connected.')}
                    {Command('bfs {u}', 'Transforms the graph into a BFS tree rooted at u if specified. If u is not given, the root is a random node.')}
                    {Command('trans', 'Turns the graph into its transpose.', ['directed'])}
                    {Command('eulcirc', 'Visualizes an eulerian circuit if one exists.', ['undirected'])}
                    {Command('eulpat', 'Visualizes an eulerian path if one exists.', ['undirected'])}
                    {Command('comp', 'Turns the graph into its complement.', ['undirected'])}
                    {Command('clear', 'Deletes all edges and nodes in the graph.')}
                    {Command('bipartite', 'Colors bipartite graphs', ['bipartite'])}
                    {Command('color [u] [col]', 'Changes the color of node u to col. col can be one of the following letters: r, g, b or v.')}
                    {Command('color [u] [v] [col]', 'Changes the color of edge (u, v) to col. col can be one of the following letters: r, g, b or v.')}
                    {Command('kosaraju', 'Transforms the graph into its corresponding strongly connected component graph.', ['directed'])}
                    {Command('dijkstra [u] [v]', 'Colors the shortest path from nodes u to v if such a path exists.', ['weighted', 'non-negative'])}
                    {Command('belford [u] [v]', 'Colors the shortest path from nodes u to v if such a path exists.', ['weighted', 'no negative cycles'])}
                    {Command('minst {u}', 'Creates a minimum spanning tree rooted at node u. If u is not specified a random node is picked as the root node.', ['weighted', 'undirected'])}
                    {Command('maxst {u}', 'Creates a maximum spanning tree rooted at node u. If u is not specified a random node is picked as the root node.', ['weighted', 'undirected'])}
                    {Command('stowag', 'Visualizes the minimum cut also known as the max flow, on an undirected graph with the Stoer-Wagner algorithm.', ['undirected'])}
                </div>
            </div>
        )
    }
}
