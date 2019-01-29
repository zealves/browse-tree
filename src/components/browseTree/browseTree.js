import React, { Component } from 'react'
import './browseTree.css'
import arrowRight from '../../assets/img/arrow-right.png'
import arrowLeft from '../../assets/img/arrow-left.png'
import folder from '../../assets/img/folder.png'
import folderClose from '../../assets/img/folderClose.png'
import dot from '../../assets/img/dot.png'
import plus from '../../assets/img/plus.png'
import plusFolder from '../../assets/img/plusFolder.png'

const Item = ({ data, index, renderChildren, columnPosition, selected, updateItem, deleteItem }) => {
    const { title, children, value } = data
    let classNames = selected === index && 'selected '
    if (children)  classNames += children.length > 0 && ' haveChildren'

    return (
        <h1 data-pos={index}  className={classNames}>
            <span className='textContent'>
                {children.length > 0 ? 
                    (selected === index ?
                        <img
                            className={'folder'}
                            alt={'#'}
                            src={folder} />
                        :
                        <img
                            className={'folder'}
                            alt={'#'}
                            src={folderClose} />)
                    : '' }
                <input  
                    readOnly
                    onDoubleClick={(e) => e.target.readOnly = false}
                    className={'editItem'}
                    type='text'
                    value={title}
                    onChange={(e) => updateItem(e.target, columnPosition, index)} />
                <span
                    style={{ display: 'block' }}
                    onClick={() => { if(window.confirm('Are you sure you want to delete this item?')) { deleteItem(columnPosition, index)}}}>
                    delete
                </span>
            </span>
            <div className={'renderChildren'} onClick={() => (value ? renderChildren(index, columnPosition, value) : renderChildren(index, columnPosition))}>
                {children.length > 0 ?
                    <img
                        className={'arrow'}
                        alt={'>'}
                        src={arrowRight}
                /> :
                    <img
                        className={'arrow'}
                        alt={'.'}
                        src={dot} />
                }
            </div>
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
            currentValue: {},
            path: []
        }
        this.defaultColumns = 7
        this.layoutOrientation = { display: this.props.orientation === 'portrait' ? 'block' : 'flex' }
        this.columnStyle = {
            minWidth: this.props.itemMinWidth || 115,
            maxWidth: this.props.itemMaxWidth || 600,
            maxHeight: this.props.itemMaxHeight || '100%'
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

        const path = this.getPath(0, selected, this.state.elements, [], [])
        this.setState({ path, maxColumns, showBackBtn, childrenElements, selectedElements: selected })
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

        const path = this.getPath(0, selectedElements, this.state.elements, [], [])
        this.setState({ path, childrenElements, selectedElements, currentValue, showBackBtn, columnPosition })
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
        const path = this.getPath(0, selectedElements, this.state.elements, [], [])
        this.setState({ path, showBackBtn, selectedElements, childrenElements })
    }

    updateItem = (target, columnPosition, index) => {
        let childrenElements = this.state.childrenElements
        let elements_ = this.state.elements
        let currentPath = {}
        
        this.state.selectedElements.forEach((v, k) => {
            if (k === 0 && elements_[v]) {
                currentPath = elements_[v]
            }
            else if (k <= columnPosition) {
                if (columnPosition === k) {
                    currentPath = currentPath.children[index]
                    currentPath.title = target.value
                    return
                }
                else {
                    currentPath = currentPath.children[v]
                }
            }
        })

        if (childrenElements[columnPosition] && childrenElements[columnPosition][index]) {
            childrenElements[columnPosition][index].title = target.value
        }
        //target.readOnly = true
        const path = this.getPath(0, this.state.selectedElements, elements_, [], [])
        this.setState({ path, childrenElements, elements: elements_ })
    }

    addItem = (columnPosition, folder) => {
        let childrenElements = this.state.childrenElements
        let elements_ = this.state.elements
        let currentPath = {}

        this.state.selectedElements.forEach((v, k) => {
            if (k === 0 && elements_[v]) {
                if (k === columnPosition) {
                    currentPath = elements_
                    let children = []
                    let title = 'New Item'
                    if (folder) {
                        children.push({ title: 'New item', children: [] })
                        title = 'New folder'
                    }
                    const newItem = { title, children }
                    currentPath.push(newItem)
                    return
                }
                else {
                    currentPath = elements_[v]
                }
            }
            else if (k <= columnPosition) {
                if (columnPosition === k) {
                    currentPath = currentPath.children
                    let children = []
                    let title = 'New Item'
                    if (folder) {
                        children.push({ title: 'New item', children: [] })
                        title = 'New folder'
                    }
                    const newItem = { title, children }
                    currentPath.push(newItem)
                    return
                }
                else {
                    currentPath = currentPath.children[v]
                    if (k === this.state.selectedElements.length - 1) {
                        currentPath = currentPath.children
                        let children = []
                        let title = 'New Item'
                        if (folder) {
                            children.push({ title: 'New item', children: [] })
                            title = 'New folder'
                        }
                        const newItem = { title, children }
                        currentPath.push(newItem)
                        return
                    }
                }
            }
        })

        const path = this.getPath(0, this.state.selectedElements, elements_, [], [])
        this.setState({ path, childrenElements, elements: elements_ })
    }

    deleteItem = (columnPosition, index) => {
        let childrenElements = this.state.childrenElements
        let elements_ = this.state.elements
        let currentPath = {}

        this.state.selectedElements.forEach((v, k) => {
            if (k === 0 && elements_[v]) {
                if (k === columnPosition) {
                    currentPath = elements_
                    currentPath.splice(index, 1)
                    return
                }
                else {
                    currentPath = elements_[v]
                }
            }
            else if (k <= columnPosition) {
                if (columnPosition === k) {
                    if (currentPath && currentPath.children)
                        currentPath.children.splice(index, 1)
                    return
                }
                else {
                    currentPath = currentPath.children[v]
                    if (currentPath && k === this.state.selectedElements.length - 1) {
                        currentPath.children.splice(index, 1)
                        return
                    }
                }
            }
        })

        /* regenerate tree */
        const data = this.generateNodes(this.state.selectedElements, elements_, 0)
        childrenElements = data.elements
        const selectedElements = data.selected
        /*  /regenerate tree */

        const path = this.getPath(0, selectedElements, elements_, [], [])
        this.setState({ path, childrenElements, elements: elements_ })
    }

    getPath = (pos, selected, list, result, path) => {
        let res = result

        if (typeof(selected[pos]) !== undefined) {
            const index = selected[pos]
            if (pos === 0) {
                list[index].selected = true
                if (list[index]) {
                    res.push(list[index])
                    path.push(list[index].title)
                    return this.getPath(1, selected, list, res, path)
                }
            }
            else {
                if (res[pos - 1] && res[pos - 1].children && res[pos - 1].children[index]) {
                    res[pos - 1].children[index].selected = true
                    res.push(res[pos - 1].children[index])
                    path.push(res[pos - 1].children[index].title)
                    return this.getPath(pos + 1, selected, list, res, path)
                }
            } 
        }
        return path
    }

    render() {
        const { childrenElements, selectedElements, currentValue, path } = this.state
        return (
            <div className='rootBrowseTree'>
                {this.props.dev && (
                <div>
                    <div><i>Orientation:  {this.props.orientation === 'portrait' ? 'portrait' : 'landscape'}</i></div>
                    <br></br>
                    <div><i>Max Columns: {this.state.maxColumns}</i></div>
                    <br></br>
                    <div><i>SelectedElements: {selectedElements.map(e => e)}</i></div>
                    <br></br>
                    <div>
                    {path.map((e, i) => (
                        path.length - 1 === i ? <i key={i} className='lastItem'>{e}</i> : (<i key={i}>{e}  | </i>)
                    ))}
                    </div>
                    <br></br>
                    <i>
                        Current State Value:
                        {JSON.stringify(currentValue)}
                    </i>
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
                                <div className={'interactionIcons'}>
                                    <img alt={'Add single item'} src={plus} className={'addItem'} onClick={() => this.addItem(pos, false)} />
                                    <img alt={'Add folder item'} src={plusFolder} className={'addFolderItem'} onClick={() => this.addItem(pos, true)} />
                                </div>
                                {item.map((e,i) =>
                                    <Item deleteItem={this.deleteItem} updateItem={this.updateItem} selected={selectedElements[pos]} columnPosition={pos} data={e} key={i} index={i} renderChildren={this.renderChildren} />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                <div>

                </div>
            </div>
        )
    }
}

export default BrowseTree