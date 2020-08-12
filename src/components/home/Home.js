import React from 'react'
import './Home.css'

export default class Home extends React.Component {
    render() {
        const funcs = ['Eulerian Path', 'Eulerian Circuit', 'K-Coloring', 'Minimum Spanning Tree',
        'Maximum Spanning Tree', 'Dijkstra\'s Algorithm', 'Bellman Ford Algorithm', 'Stoer Wagner Algorithm',
        'Kosaraju\'s Algorithm', 'Breadth First Search', 'Graph Complement', 'Graph Transpose']
        return (
            <div id = 'home-features-list'>
                <div>
                    <div className = 'title'> Welcome to [name]! </div>
                    <img src='bonk' alt='cute image from graphing tool'></img>
                    <div> A free, simple and efficient graphing tool for Computer Science students. </div>
                    <a href='https://github.com'> (and now open source!) </a>
                    <div>
                        [name] is an ever evolving graphing library and tool that strives to be useful to
                        Computer Science students through:
                    </div>
                </div>
                <div className = 'feature-sect'>
                    <div id = 'design'>
                        <div className='subtitle'>Intuative and Simple Design</div>
                        <div> blah blah blah UX and UI choices blah blah</div>
                    </div>
                    <img alt='(gif of simple use)' className='disp' />
                </div>
                <div className = 'feature-sect'>
                    <div className = 'disp'>
                        <img alt='why' />
                    </div>

                    <div id = 'efficiency'>
                        <div className='subtitle'> Efficiency and Coder Accessibility </div>
                        <div> designed for programmers blah blah command line interface streamlines process blah blah </div>
                    </div>
                </div>
                <div className = 'feature-sect'>
                    <div id = 'functionality'>
                        <div className='subtitle'> Large and Increasing Functionality </div>
                        <div> [name] features an ever growing list of useful algorithms and features. </div>
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
