// @fileoverview React Component for the Dev Blog tab. Reads data from the
// blogs.json file

/* eslint-disable */

import React from 'react'
import blogs from './blogs.json'
import './devblog.css'

export default class DevBlog extends React.Component {

    render() {
        return (
            <div className = 'container-md'>
                <div id ='main-title' className='title'> Developer Blog </div>
                {
                    blogs.map((post, index) => this.renderPost(post, index))
                }
            </div>
        )
    }
    renderPost(post, index) {
        let title = post.title
        let content = post.content
        return (
            <div key={index} className = 'post-content m-2 p-2 d-flex flex-column'>
                <div className = 'subtitle'> {title} </div>
                {
                    content.map((item, i) => {
                        switch(item.type) {
                            case 'p':
                                return <div key={i}> {item.content.join('')} </div>
                            case 'i':
                                return (
                                    <div key={i} className = 'post-image'>
                                        {this.toImg(item.src, item.width)}
                                        <div>{item.desc}</div>
                                    </div>
                                )
                            case 'l':
                                return (<ul>{item.content.map((li, lind) => <li>{li}</li>)}</ul>)
                        }
                    })
                }
            </div>
        )
    }

    toImg(icon, width) {
        return <img className = 'img-fluid img-thumbnail' src={require('../../assets/' + icon)} />
    }
}
