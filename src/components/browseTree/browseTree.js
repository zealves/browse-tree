import React, { Component } from 'react'
import './browseTree.css'
import arrowRight from '../../assets/img/arrow-right.png'
import arrowLeft from '../../assets/img/arrow-left.png'
import folder from '../../assets/img/folder.png'
import folderClose from '../../assets/img/folderClose.png'

const Item = ({ data, index, renderChildren, columnPosition, selected }) => {
    const { title, children, value } = data
    let classNames = selected === index && 'selected '
    if (children)  classNames += children.length > 0 && ' haveChildren'

    return (
        <h1 data-pos={index} onClick={() => (value ? renderChildren(index, columnPosition, value) : renderChildren(index, columnPosition))} className={classNames}>
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
            currentValue: {}
        }
        this.defaultColumns = 7

        this.layoutOrientation = { display: this.props.orientation === 'portrait' ? 'block' : 'flex' }
        this.columnStyle = {
            minWidth: this.props.itemMinWidth || 115,
            maxWidth: this.props.itemMaxWidth || 600
        }
    }

    componentDidMount = () => {
        let selectedElements = this.state.selectedElements
        let showBackBtn = false
        let childrenElements = []
        const { elements, selected } = this.generateNodes(selectedElements, this.state.elements, 0)
        const maxColumns = (parseInt(this.props.maxColumns) >= 0) ? parseInt(this.props.maxColumns) : this.defaultColumns

        childrenElements = elements
        childrenElements = this.hideElements(1, childrenElements, maxColumns)

        childrenElements.forEach(e => {
            if (e.hidden) showBackBtn = true
        })

        this.setState({ maxColumns, showBackBtn, childrenElements, selectedElements: selected })
    }

    generateNodes = (selectedElements, currentElement, position) => {
        let { elements, selected } = this.getElementNode([], [], currentElement, selectedElements, position)
        if (elements.length > 0 && elements[elements.length - 1] && elements[elements.length - 1].length <= 0) {
            elements.pop()
        }
        return { elements, selected }
    }

    getElementNode = (generatedelements, generatedSelected, currentElement, selectedElements, position) => {
        if (position === 0) {
            const ind = selectedElements[position]
            generatedelements.push(currentElement)
            generatedSelected.push(ind)
            if (currentElement[ind] && currentElement[ind].children) {
                currentElement = currentElement[ind].children
                generatedelements.push(currentElement)
                return this.getElementNode(generatedelements, generatedSelected, currentElement, selectedElements, position + 1)
            }
        }
        else if (selectedElements[position] !== undefined && parseInt(selectedElements[position]) >= 0) {
            const ind = selectedElements[position]
            if (currentElement[ind] && currentElement[ind].children) {
                generatedelements.push(currentElement[ind].children)
                generatedSelected.push(ind)
                currentElement = currentElement[ind].children
                return this.getElementNode(generatedelements, generatedSelected, currentElement, selectedElements, position + 1)
            }
        }
        return { elements: generatedelements, selected: generatedSelected }
    }
    
    renderChildren = (index, columnPosition, value) => {
        let { childrenElements, selectedElements, maxColumns } = this.state
        let showBackBtn = false        

        selectedElements = selectedElements.filter((v, i) => (i < columnPosition))
        selectedElements.push(index)
        const data = this.generateNodes(selectedElements, this.state.elements, 0)

        childrenElements = data.elements
        selectedElements = data.selected

        childrenElements = this.hideElements(1, childrenElements, maxColumns)        
        childrenElements.forEach(e => {
            if (e.hidden) showBackBtn = true
        })

        let currentValue = {}
        if (value) {
            currentValue = value
        } 
        this.setState({ childrenElements, selectedElements, currentValue, showBackBtn, columnPosition })
        this.props.onUpdate(currentValue)
    }

    hideElements = (columnPosition, childrenElements, maxColumns) => {
        if (columnPosition > 0 && parseInt(maxColumns) > 0 && childrenElements.length >= parseInt(maxColumns)) {
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
        return childrenElements
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
        const { childrenElements, selectedElements, currentValue } = this.state
        return (
            <div className='rootBrowseTree'>
                {this.props.dev && (
                <div>
                    <h1>Orientation:  {this.props.orientation === 'portrait' ? 'portrait' : 'landscape'}</h1>
                    <h1>Max Columns: {this.state.maxColumns}</h1>
                    <h1>SelectedElements: {selectedElements.map(e => e)}</h1>
                    <h1>
                        Current State Value:
                        {JSON.stringify(currentValue)}
                    </h1>
                    <br></br>
                    <br></br>
                </div>
                )}
                <section className='browseTree animated fadeIn'> 
                    <div className='browseSubTree' style={this.layoutOrientation}>
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
                    </div>
                </section>
            </div>
        )
    }
}

export default BrowseTree