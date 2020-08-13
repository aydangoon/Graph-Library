import React from 'react'
import blogs from './blogs.json'
import './DevBlog.css'

export default class DevBlog extends React.Component {

    render() {
        return (
            <div>
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
            <div key={index} className = 'post-content'>
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
        return <img width={width} src={require('../../assets/' + icon)} />
    }
}
