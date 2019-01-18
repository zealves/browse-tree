import React, { Component } from 'react'
import './browseTree.css'
import arrowRight from '../../assets/img/arrow-right.png'
import arrowLeft from '../../assets/img/arrow-left.png'
import folder from '../../assets/img/folder.png'

const Item = ({ data, index, renderChildren, columnPosition, selected }) => {
    const { title, children } = data
    let classNames = selected === index && 'selected '
    classNames += children.length > 0 && ' haveChildren'
    return (
        <h1 data-pos={index} onClick={() => renderChildren(index, children, columnPosition)} className={classNames}>
            <span className='textContent'>
                {children.length > 0 && <img className={'folder'} alt={'#'} src={folder} />}
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
            showBackBtn: false
        }
        this.defaultColumns = 7
    }

    componentDidMount = () => this.generateTree()
    
    generateTree = () => {
        const { elements, selectedElements } = this.state
        let showBackBtn = false
        let selectedElements_ = selectedElements
        let childrenElements = []
        childrenElements.push(this.props.elements)
            
        if (elements.length > 0 && selectedElements_.length > 0) {
            let currentChildren = []
            for (let i = 0; i < selectedElements_.length; i++) {
                const ind = selectedElements_[i]
                if (i === 0) {
                    if (elements[ind] && elements[ind].children && elements[ind].children.length > 0) {
                        childrenElements.push(elements[ind].children)
                        currentChildren = elements[ind].children
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

        if (maxColumns > 0 && selectedElements_.length >= maxColumns) {
            
            
            if (childrenElements.length >= parseInt(maxColumns)) {
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
        }

        this.setState({ selectedElements: selectedElements_,elements: this.props.elements, childrenElements, maxColumns, showBackBtn })

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

        this.setState({ showBackBtn, childrenElements, columnPosition, selectedElements })
    }

    back = () => {
        let { selectedElements, childrenElements } = this.state
        let showBackBtn = false
        
        selectedElements.pop()
        childrenElements.pop()
        if (childrenElements.length >= parseInt(this.state.maxColumns)) {
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
        const { childrenElements, selectedElements } = this.state

        return (
            <div>
                <h1>Max Columns: {this.state.maxColumns}</h1>
                <h1>Path: {this.state.selectedElements.map(e => e)}</h1>
                <div className={'browseTree'}> 
                    <div className='browseSubTree'>
                        {this.state.showBackBtn && (
                            <div className={'backBtnContent'}>
                                <img className={'backBtn'} onClick={this.back} src={arrowLeft} alt='Back' />
                            </div>
                        )}
                        {childrenElements.map((item, pos) => (
                            <div className={item.hidden ? 'columnHidden' : (item.length > 0 ? 'column' : '')} key={pos}>
                                {item.map((e,i) =>
                                    <Item selected={selectedElements[pos]} columnPosition={pos} data={e} key={i} index={i} renderChildren={this.renderChildren} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default BrowseTree