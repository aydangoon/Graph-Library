import React from 'react'
import './Home.css'

export default class Home extends React.Component {
    render() {
        const funcs = ['Eulerian Path', 'Eulerian Circuit', 'K-Coloring', 'Minimum Spanning Tree',
        'Maximum Spanning Tree', 'Dijkstra\'s Algorithm', 'Bellman Ford Algorithm', 'Stoer Wagner Algorithm',
        'Kosaraju\'s Algorithm', 'Breadth First Search', 'Graph Complement', 'Graph Transpose', 'And more!']
        return (
            <div>
                <div id = 'greeting'>
                    <img src={require('../../assets/logo.png')} width={350} alt='logo' id='logo'></img>
                    <div className = 'title'> Welcome to the Lithe <span className='lithe-blue'>Graphing</span> <span className='lithe-green'>Library</span></div>
                    <div>
                        <div className = 'subtitle'> A simple and practical graphing tool </div>
                        <a href='https://github.com'> and now open source </a>
                    </div>
                </div>
                <div className = 'feature-sect'>
                    <div className = 'feature-text'>
                        <div className='title'><span className = 'lithe-red'>Intuative</span></div>
                        <div className='feature-paragraph'>
                            LitheGL is designed with users in mind. Only the necessary components needed to interface
                            with your graph are included in the build.
                            LitheGL features simple drag and selection features
                            alongside a suite of other tools to streamline the process of building and analyizing graphs.
                        </div>
                    </div>
                    <div id = 'intuative'className = 'disp'>
                        <img src={require('../../assets/design.png')}
                            alt='(gif of simple use)'
                            width={700}/>
                    </div>
                </div>
                <div className = 'feature-sect'>
                    <div id = 'efficiency' className = 'disp'>
                        <img width={400} src={require('../../assets/cli.png')}alt='why' />
                        <img width={200} src={require('../../assets/cli_graph.png')}alt='why' />
                    </div>
                    <div className = 'feature-text'>
                        <div className='title'> <span className = 'lithe-blue'>Efficient</span> </div>
                        <div className='feature-paragraph'>
                            LitheGL features a command line interface with a set of straight forward commands
                            that make the graph creation and editting process that much easier. The command line
                            can be used to automate many traditional slow graph processes as well as to quickly
                            change and analyise your graph.
                        </div>
                    </div>
                </div>
                <div className = 'feature-sect'>
                    <div className = 'feature-text'>
                        <div className='title'> <span className = 'lithe-green'>Functional </span> </div>
                        <div className='feature-paragraph'>
                            LitheGL features an ever growing list of useful algorithms and features.
                            All the common algorithms learned in introductory Computer Science classes are included
                            as well as algorithms for quickly changing graph state. As LitheGL is still in development,
                            more are to come!
                        </div>
                    </div>
                    <div className='disp' id = 'functions-list-wrapper'>
                        <div id = 'functions-list'>
                            {funcs.map((item, index) => {
                                return <div key={index}>{item}</div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
