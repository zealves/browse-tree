import React, { Component } from 'react'
import './fullpage.css'
import debounce from 'lodash/debounce'
import verticalScroll from '../../assets/img/verticalScroll.svg'
import horizontalScroll from '../../assets/img/horizontal.png'

let start = { pageX: 0, pageY: 0 }

class FullPage extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            currentPage: null,
            pages: []
        }
    }

    componentDidMount = () => {
        let pages = []
        let currentPage = this.state.currentPage
        const { children } = this.props
        if (children && Object.keys(children).length > 0) {
            children.forEach((content, page) => {
                const { className, orientation } = content.props
                if (!className.includes('fullpage'))
                    return
                let curPage = {
                    orientation: 'vertical',
                    index: page,
                    content: content
                }
                if (pages.length <= 0) currentPage = curPage
                if (orientation && orientation === 'horizontal') curPage.orientation = orientation
                pages.push(curPage)
            })
        }
        
        document.querySelector('body').style.overflow = 'hidden'
        window.addEventListener('wheel', this.wheel)
        window.addEventListener('touchstart', this.touchstart)
        window.addEventListener('touchend', this.touchend)
        
        this.setState({ pages, currentPage })
    }

    wheel = debounce((e) => {
        if (e.deltaY < 0) this.previous()
        else if (e.deltaY > 0) this.next()
    }, 150)

    touchstart = debounce((e) => {
        const { pageX, pageY } = e.changedTouches[0]
        start = { pageX, pageY }
    }, 0)

    touchend = debounce((e) => {
        let { currentPage } = this.state
        const { pageX, pageY } = e.changedTouches[0]
        const end = { pageX, pageY }
        const orientation = currentPage.orientation
        
        //TODO
        const sx = start.pageX - end.pageX
        const ex = end.pageX - start.pageX
        console.log(sx, ex)  

        if (orientation === 'horizontal') {
            if (start.pageX > end.pageX) {
                this.next()
            } else if (start.pageX < end.pageX) {
                this.previous()
            }
        }
        else {
            if (start.pageY > end.pageY) {
                this.next()
            } else if (start.pageY < end.pageY) {
                this.previous()
            }
        }
    }, 150)

    next = () => {
        let { currentPage, pages } = this.state
        const nextIndex = parseInt(currentPage.index) + 1
        if (nextIndex > 0 && pages[nextIndex]) {
            currentPage = pages[nextIndex]
        }
        this.setState({ currentPage })
        const id = currentPage.index + '_single_element'
        this.scrollTo(document.getElementById(id))
    }
    
    previous = () => {
        let { currentPage, pages } = this.state
        const previousIndex = parseInt(currentPage.index) - 1
        if (previousIndex >= 0 && pages[previousIndex]) {
            currentPage = pages[previousIndex]
        }
        this.setState({ currentPage })

        const id = currentPage.index + '_single_element'
        this.scrollTo(document.getElementById(id))        
    }

    scrollTo = (elem) => {
        const orientation = this.state.currentPage.orientation
        if (orientation === 'horizontal') {
            window.scroll({
                behavior: 'smooth',
                left: elem.offsetLeft,
                top: 0
            })
        }
        else {
            window.scroll({
                behavior: 'smooth',
                top: elem.offsetTop
            })
        }
    }

    goToPage = async(page) => {
        const { pages } = this.state
        if (pages[page]) {
            const currentPage = pages[page]
            await this.setState({ currentPage })  
            const id = pages[page].index + '_single_element'
            this.scrollTo(document.getElementById(id))  
        }
    }

    /*
    TODO
    https://jsfiddle.net/fgax8ecz/6/
    https://css-tricks.com/practical-css-scroll-snapping/
    https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
    
    scroll trigger events 
    http://scrollmagic.io/examples/advanced/custom_containers.html

    <scroll-container>

    </scroll-container>



    https://www.digitalocean.com/community/tutorials/como-construir-uma-aplicacao-node-js-com-o-docker-pt
    */

    render() {
        const { pages, currentPage } = this.state
        const arrow = currentPage && currentPage.orientation === 'horizontal' ? horizontalScroll : verticalScroll
        const orientation = currentPage && currentPage.orientation === 'horizontal' ? 'horizontal' : 'vertical'
        return (
            <div>
                <div className={'fixedPages ' + orientation}>
                    {pages.map((e, i) =>
                        <h1 onClick={() => this.goToPage(i)} className={'goToPage ' + (currentPage && currentPage.index === i ? 'current' : '')} key={i}>{i + 1}</h1>
                    )}
                </div>
                <img className={'scrollArrow'} src={arrow} alt='' />
                <div className={'fullpageElements ' + orientation}>
                    {pages.map((e, i) =>
                        <div id={`${i}_single_element`} key={i} className={currentPage.index !== i ? 'hidden' : 'singleElement'}>
                            {e.content}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default FullPage