// @fileoverview React Component for the Home tab.

/* eslint-disable */

import React from 'react'
import './Home.css'

export default class Home extends React.Component {
    render() {
        const funcs = ['Eulerian Path', 'Eulerian Circuit', 'K-Coloring', 'Minimum Spanning Tree',
        'Maximum Spanning Tree', 'Dijkstra\'s Algorithm', 'Bellman Ford Algorithm', 'Stoer Wagner Algorithm',
        'Kosaraju\'s Algorithm', 'Breadth First Search', 'Graph Complement', 'Graph Transpose', 'And more!']
        const features =
                        [
                            {title: 'Graph Sharing', desc: 'Export and import graphs with the click of a button.', img: this.toImg('share.png')},
                            {title: 'Export as Image', desc: 'Share your graph as an image.', img: this.toImg('image.png')},
                            {title: 'Directed and Undirected', desc: '', img: this.toImg('simple.png')},
                            {title: 'Weighted and Unweighted', desc: '', img: this.toImg('simple.png')},
                            {title: 'Aesthetic Customization', desc: 'LitheGL supports a wide array of graph customization features.', img: this.toImg('customize.png')}
                        ]
        const coming =
            [
                {title: 'Support for Multigraphs', img: this.toImg('simple.png')},
                {title: 'Hamiltonian Cycle and Path Algorithms', img: this.toImg('simple.png')},
                {title: 'Greater Aesthetic Customization', img: this.toImg('customize.png')},
                {title: 'Documentation', img: this.toImg('docs.png')}
            ]
        return (
            <div className = 'container-xl p-4'>
                <div id = 'greeting' className = 'm-5 p-2'>
                    <img className = 'img-fluid' src={require('../../assets/logo.png')} alt='logo' />
                    <div className = 'title'> Welcome to the Lithe <span className='lithe-blue'>Graphing</span> <span className='lithe-green'>Library</span></div>
                    <div>
                        <div className = 'subtitle'> A simple and practical graphing tool </div>
                        <a href='https://github.com/aydangoon/Graph-Library'> (and now open source) </a>
                    </div>
                </div>
                <div className = 'row align-items-center m-5 slow-fade'>
                    <div className = 'col-4 d-flex flex-column'>
                        <div className='title'><span className = 'lithe-red'>Intuitive</span></div>
                        <div className='feature-paragraph'>
                            LitheGL is designed with users in mind. Only the necessary components needed to interface
                            with your graph are included in the build.
                            LitheGL features simple drag and selection features
                            alongside a suite of other tools to streamline the process of building and analyizing graphs.
                        </div>
                    </div>
                    <div className = 'col-8'>
                        <img className = 'img-fluid rounded' id = 'intuative' src={require('../../assets/design.png')}
                            alt='(gif of simple use)'/>
                    </div>
                </div>
                <div className = 'row align-items-center m-5 slow-fade'>
                    <div className = 'col-8 rounded' id = 'efficiency'>
                        <img className = 'img-fluid' id='eff-img-1'  src={require('../../assets/cli.png')} alt='why' />
                        <img className = 'img-fluid' id='eff-img-2' src={require('../../assets/cli_graph.png')} alt='why' />
                    </div>
                    <div className = 'col-4'>
                        <div className='title'> <span className = 'lithe-blue'>Efficient</span> </div>
                        <div className='feature-paragraph'>
                            LitheGL features a command line interface with a set of straight forward commands
                            that make the graph creation and editting process that much easier. The command line
                            can be used to automate many traditional slow graph processes as well as to quickly
                            change and analyize your graph.
                        </div>
                    </div>
                </div>
                <div className = 'row align-items-center m-5 slow-fade'>
                    <div className = 'col-4'>
                        <div className='title'> <span className = 'lithe-green'>Functional </span> </div>
                        <div className='feature-paragraph'>
                            LitheGL features an ever growing list of useful algorithms and features.
                            All the common algorithms learned in introductory Computer Science classes are included
                            as well as algorithms for quickly changing graph state. As LitheGL is still in development,
                            more are to come!
                        </div>
                    </div>
                    <div className='col-8' id = 'functions-list-wrapper'>
                        <div id = 'functions-list'>
                            {funcs.map((item, index) => {
                                return <div key={index}>{item}</div>
                            })}
                        </div>
                    </div>
                </div>
                <div className = 'container-fluid d-flex flex-column m-5 slow-fade'>
                    <div>
                        <div className = 'subtitle'>Current Features</div>
                        <div id = 'current-features' className = 'features-list'>
                            {features.map((item, index) => this.toFeature(item, index))}
                        </div>
                    </div>
                    <div>
                        <div className = 'subtitle'>What's Coming</div>
                        <div id = 'planned-features' className = 'features-list'>
                            {coming.map((item, index) => this.toFeature(item, index))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    toFeature(feature, index) {
        return (
            <div key={index}>
                {feature.img}
                <div>
                    <div className = 'section-label'>{feature.title}</div>
                    <div> {feature.desc} </div>
                </div>
            </div>
        )
    }

    toImg(icon) {
        return <img width={40} height={40} src={require('../../assets/' + icon)} />
    }
}
