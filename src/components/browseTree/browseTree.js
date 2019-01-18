import React, { Component } from 'react'
import './browseTree.css'
import arrowRight from '../../assets/img/arrow-right.png'
import arrowLeft from '../../assets/img/arrow-left.png'
import folder from '../../assets/img/folder.png'
import folderClose from '../../assets/img/folderClose.png'
import Box from 'react-inln'

/*
    TODO
    1) Add items
    2) Add preview view
*/

const Item = ({ data, index, renderChildren, columnPosition, selected }) => {
    const { title, children, items } = data
    let classNames = selected === index && 'selected '
    if (children)  classNames += children.length > 0 && ' haveChildren'

    return (
        <h1 data-pos={index} onDoubleClick={() => (items ? renderChildren(index, items, columnPosition) : renderChildren(index, children, columnPosition))} className={classNames}>
            <span className='textContent'>
                {children.length > 0 ? 
                    (selected === index ? <img className={'folder'} alt={'#'} src={folder} /> : <img className={'folder'} alt={'#'} src={folderClose} />)
                    : '' }
                {title}
            </span>
            {children.length > 0 &&
                <img className={'arrow'} alt={'>'} src={arrowRight}
            />}
        </h1>
    )
}

class BrowseTree extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            elements: this.props.elements || [],
            childrenElements: [],
            columnPosition: 0,
            selectedElements: this.props.selectedElements || [],
            maxColumns: null,
            showBackBtn: false,
            path: []
        }
        this.defaultColumns = 7
        this.columnStyle = {
            minWidth: this.props.itemMinWidth || 115,
            maxWidth: this.props.itemMaxWidth || 600
        }
    }

    componentDidMount = () => this.generateTree()
    
    generateTree = () => {
        const { elements, selectedElements, path } = this.state
        let showBackBtn = false
        let selectedElements_ = selectedElements
        let childrenElements = []
        childrenElements.push(this.props.elements)
        let path_ = path
        if (elements.length > 0 && selectedElements_.length > 0) {
            let currentChildren = []
            for (let i = 0; i < selectedElements_.length; i++) {
                const ind = selectedElements_[i]
                if (i === 0) {
                    if (elements[ind] && elements[ind].children && elements[ind].children.length > 0) {
                        childrenElements.push(elements[ind].children)
                        currentChildren = elements[ind].children
                        path_.push(elements[ind].title)
                    }
                    else {
                        selectedElements_ = selectedElements_.filter((v, k) => (k === 0))
                        break
                    }
                }
                else {
                    if (currentChildren[ind] && currentChildren[ind].children.length > 0) {
                        currentChildren = currentChildren[ind].children
                        childrenElements.push(currentChildren)
                        if (currentChildren[ind] && currentChildren[ind].title) {
                            path_.push(currentChildren[ind].title)
                        }
                    }
                    else {
                        if (currentChildren[ind] && currentChildren[ind].children) {
                            selectedElements_ = selectedElements_.filter((v, k) => (k <= i))
                        }
                        else {
                            selectedElements_ = selectedElements_.filter((v, k) => (k < i))
                        }
                        break
                    }
                }
            }
        }

        let maxColumns = (parseInt(this.props.maxColumns) >= 0) ? parseInt(this.props.maxColumns) : this.defaultColumns
        if (childrenElements.length > 0) {
            const limit = childrenElements.length - parseInt(maxColumns)
            for (let i = 0; i < childrenElements.length; i++) {
                if (i < limit) {
                    childrenElements[i].hidden = true
                    showBackBtn = true
                }
                else {
                    childrenElements[i].hidden = false
                }
            }
        }

        this.setState({ path: path_, selectedElements: selectedElements_,elements: this.props.elements, childrenElements, maxColumns, showBackBtn })

    }
    
    renderChildren = (index, children, columnPosition) => {
        let { childrenElements, selectedElements  } = this.state
        let showBackBtn = false

        if (columnPosition === 0) {
            childrenElements = []
            selectedElements = []
            childrenElements.push(this.state.elements)
            childrenElements.push(children)
            selectedElements.push(index)
        }
        else {
            childrenElements = childrenElements.filter((v, i) => (i < columnPosition + 1))
            
           if (children.length > 0) childrenElements.push(children)
            
            selectedElements = selectedElements.filter((v, i) => (i < columnPosition))
            selectedElements.push(index)
        }

       if (columnPosition === 0 && children.length <= 0) {

       }
       else if (parseInt(this.state.maxColumns) > 0 && childrenElements.length >= parseInt(this.state.maxColumns)) {
            const limit = childrenElements.length - parseInt(this.state.maxColumns)
            
            for (let i = 0; i < limit; i++) {
                childrenElements[i].hidden = true
                showBackBtn = true
            }
        }

        childrenElements.forEach(e => {
            if (e.hidden) showBackBtn = true
        })
        this.setState({ showBackBtn, childrenElements, columnPosition, selectedElements })
    }

    back = () => {
        let { selectedElements, childrenElements } = this.state
        let showBackBtn = false
        selectedElements.pop()
        childrenElements.pop()
        if (childrenElements.length > 0) {
            const limit = childrenElements.length - parseInt(this.state.maxColumns)
            for (let i = 0; i < childrenElements.length; i++) {
                if (i < limit) {
                    childrenElements[i].hidden = true
                    showBackBtn = true
                }
                else {
                    childrenElements[i].hidden = false
                }
            }
        }
        this.setState({ showBackBtn, selectedElements, childrenElements })
    }

    render() {
        const { childrenElements, selectedElements, path } = this.state
        return (
            <div className='rootBrowseTree'>
                {this.props.dev && (
                <div>
                    <h1>Orientation:  {this.props.orientation === 'portrait' ? 'portrait' : 'landscape'}</h1>
                    <h1>Max Columns: {this.state.maxColumns}</h1>
                    <h1>SelectedElements: {selectedElements.map(e => e)}</h1>
                    <h1>Path: {path.map((e, pos) => (
                        path[pos + 1] ? e + ' | ' : e
                    ))}</h1>
                    <br></br>
                    <br></br>
                </div>
                )}
                <section className='browseTree animated fadeIn'> 
                    <Box tag='div' className='browseSubTree' display={this.props.orientation === 'portrait' ? 'block' : 'flex'}>
                        {this.state.showBackBtn && (
                            <div className={'backBtnContent'}>
                                <img className={'backBtn'} onClick={this.back} src={arrowLeft} alt='Back' />
                            </div>
                        )}
                        {childrenElements.map((item, pos) => (
                            <div style={this.columnStyle} className={item.hidden ? 'columnHidden' : (item.length > 0 ? 'column' : '')} key={pos}>
                                {item.map((e,i) =>
                                    <Item selected={selectedElements[pos]} columnPosition={pos} data={e} key={i} index={i} renderChildren={this.renderChildren} />
                                )}
                            </div>
                        ))}
                    </Box>
                </section>
            </div>
        )
    }
}

export default BrowseTree