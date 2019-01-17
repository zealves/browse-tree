import React, { Component } from 'react'
import './browseTree.css'
import arrowRight from '../../assets/img/arrow-right.png'
import arrowLeft from '../../assets/img/arrow-left.png'

const Item = ({ data, index, renderChildren, columnPosition, selected }) => {
    const { title, children } = data
    return (
        <h1 data-pos={index} onClick={() => renderChildren(index, children, columnPosition)} className={selected === index ? 'selected' : ''}>
            <span>{title}</span>
            {children.length > 0 && <img className={'arrow'} alt={'.'} src={arrowRight} />}
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
    }

    componentDidMount = () => {
        this.generateTree()
    }
    
    generateTree = () => {
        const { elements, selectedElements } = this.state
        let showBackBtn = false
        let childrenElements = []
        childrenElements.push(this.props.elements)
        
        if (elements.length > 0 && selectedElements.length > 0) {
            let currentChildren = null
            for (let i = 0; i <= selectedElements.length; i++) {
                if (i === 0) {
                    const ind = selectedElements[i]
                    childrenElements.push(elements[ind].children)
                    currentChildren = elements[ind].children
                    
                }
                else {
                    const ind = selectedElements[i]
                    console.log(childrenElements, currentChildren,ind, selectedElements)
                    if (selectedElements[i] && currentChildren[ind] && currentChildren[ind].children ) {
                        currentChildren = currentChildren[ind].children
                        childrenElements.push(currentChildren)
                    }
                    
                }
            }
        }

console.log(childrenElements)
        let maxColumns = (parseInt(this.props.maxColumns) >= 0) ? parseInt(this.props.maxColumns) : -1

        if (maxColumns > 0 && selectedElements.length > maxColumns) {
            showBackBtn = true
            
            if (childrenElements.length >= parseInt(maxColumns)) {
                const limit = childrenElements.length - parseInt(maxColumns)
                for (let i = 0; i < childrenElements.length; i++) {
                    if (i < limit) {
                        childrenElements[i].hidden = true
                    }
                    else {
                        childrenElements[i].hidden = false
                    }
                }
            }
        }

        this.setState({ elements: this.props.elements, childrenElements, maxColumns, showBackBtn })

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
            childrenElements = childrenElements.filter((v, i) => {
                return (i < columnPosition + 1)
            })
            
           if (children.length > 0) {
            childrenElements.push(children)
           }
            
            selectedElements = selectedElements.filter((v, i) => {
                return (i < columnPosition)
            })
            selectedElements.push(index)
        }

        if (parseInt(this.state.maxColumns) > 0 && childrenElements.length > parseInt(this.state.maxColumns)) {
            const limit = childrenElements.length - parseInt(this.state.maxColumns)
            showBackBtn = true

            for (let i = 0; i < limit; i++) {
                childrenElements[i].hidden = true
            }
        }

        this.setState({ showBackBtn, childrenElements, columnPosition, selectedElements })
    }

    back = () => {
        let { selectedElements, childrenElements } = this.state
        let showBackBtn = false
        
        selectedElements.pop()
        childrenElements.pop()

        if (childrenElements.length > parseInt(this.state.maxColumns)) showBackBtn = true
        
        if (childrenElements.length >= parseInt(this.state.maxColumns)) {
            const limit = childrenElements.length - parseInt(this.state.maxColumns)
            for (let i = 0; i < childrenElements.length; i++) {
                if (i < limit) {
                    childrenElements[i].hidden = true
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
        )
    }
}

export default BrowseTree