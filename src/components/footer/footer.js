import React from 'react'

export default class Footer extends React.Component {
    render() {
        return (
            <footer className = 'container-fluid' id="footer">
                <div className = 'row h-100 align-items-center'>
                    <div className = 'col-4 d-flex'>
                        <a href='https://github.com/aydangoon' className = 'px-1'><img src={require('../../assets/git.png')} alt='wat' width='30px'></img></a>
                        <a href='https://www.linkedin.com/in/aydan-gooneratne-118b49178/' className = 'px-1'><img src={require('../../assets/lin.png')} alt='wat' width='30px'></img></a>
                    </div>
                    <div className = 'col-4 d-flex justify-content-center'> Contact: aydan.gooneratne@gmail.com </div>
                    <div className = 'col-4 d-flex justify-content-end'><a href="https://smashicons.com/" title="Smashicons">Icons: Smashicons</a></div>
                </div>
            </footer>
        )
    }
}
