import React, { Component } from 'react'
import './browseTree.css'
import arrowRight from '../../assets/img/arrow-right.png'
import arrowLeft from '../../assets/img/arrow-left.png'
import folder from '../../assets/img/folder.png'
import folderClose from '../../assets/img/folderClose.png'
import dot from '../../assets/img/dot.png'
import plus from '../../assets/img/plus.png'
import plusFolder from '../../assets/img/plusFolder.png'
import save from '../../assets/img/save.png'

const Item = ({ data, index, renderChildren, columnPosition, selected, updateItem, deleteItem, editItems }) => {
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
                    onDoubleClick={(e) => editItems && (e.target.readOnly = false)}
                    className={'editItem'}
                    type='text'
                    title={title}
                    value={title}
                    onChange={(e) => editItems && updateItem(e.target, columnPosition, index)} />
                {editItems && <span
                    style={{ display: 'block' }}
                    onClick={() => { if(window.confirm('Are you sure you want to delete this item?')) { deleteItem(columnPosition, index)}}}>
                    delete
                </span>}
            </span>
            <div className={'renderChildren'} onClick={() => (value ? renderChildren(index, columnPosition, value) : renderChildren(index, columnPosition, title))}>
                {children.length > 0 ?
                    <img
                        title={'Open folder'}
                        className={'arrow'}
                        alt={'>'}
                        src={arrowRight}
                /> :
                    <img
                        title={'Select item'}
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
            path: [],
            editItems: this.props.editItems || false,
            addItems: this.props.addItems || false,
            saveItems: false
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
        const { path, children, selectedValues } = this.getElements(0, selectedElements, this.state.elements, [], [], [])
        const maxColumns = (parseInt(this.props.maxColumns) >= 0) ? parseInt(this.props.maxColumns) : this.defaultColumns
        childrenElements = children
        childrenElements = this.hideElements(1, childrenElements, maxColumns)
        childrenElements.forEach(e => {
            if (e.hidden) showBackBtn = true
        })
        this.setState({ path, maxColumns, showBackBtn, childrenElements, selectedElements: selectedValues })
    }
    
    renderChildren = (index, columnPosition, value) => {
        let { childrenElements, selectedElements, maxColumns } = this.state
        let showBackBtn = false        

        selectedElements = selectedElements.filter((v, i) => (i < columnPosition))
        selectedElements.push(index)

        const { path, children, selectedValues } = this.getElements(0, selectedElements, this.state.elements, [], [], [])
        selectedElements = selectedValues
        childrenElements = children
        childrenElements = this.hideElements(1, childrenElements, maxColumns)
        childrenElements.forEach(e => {
            if (e.hidden) showBackBtn = true
        })

        let currentValue = {}
        if (value) {
            currentValue = value
        }
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
        const { path, children } = this.getElements(0, selectedElements, this.state.elements, [], [], [])
        this.setState({ showBackBtn, selectedElements, childrenElements: children, path })
    }

    updateItem = (target, columnPosition, index) => {
        let childrenElements = this.state.childrenElements
        let elements_ = this.state.elements
        let currentPath = {}
        const selectedElements = this.state.selectedElements

        selectedElements.forEach((v, k) => {
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

        const { path } = this.getElements(0, selectedElements, elements_, [], [], [])
        const saveItems = this.props.saveItems || false
        this.setState({ saveItems, path, childrenElements, elements: elements_ })
    }

    addItem = (columnPosition, folder) => {
        let childrenElements = this.state.childrenElements
        let elements_ = this.state.elements
        let currentPath = {}
        let selectedElements = this.state.selectedElements
        selectedElements.forEach((v, k) => {
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
                    if (k === selectedElements.length - 1) {
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

        const { path } = this.getElements(0, selectedElements, elements_, [], [], [])
        const saveItems = this.props.saveItems || false
        this.setState({ saveItems, path, childrenElements, elements: elements_ })
    }

    deleteItem = (columnPosition, index) => {
        let childrenElements = this.state.childrenElements
        let elements_ = this.state.elements
        let currentPath = {}
        let showBackBtn = false
        let selectedElementsAfterDelete = []
        this.state.selectedElements.forEach((v, k) => {
            if (k === 0 && elements_[v]) {
                if (k === columnPosition) {
                    currentPath = elements_
                    currentPath.splice(index, 1)
                    return
                }
                else {
                    selectedElementsAfterDelete.push(v)
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
                    selectedElementsAfterDelete.push(v)
                }
            }
        })

        if (this.state.selectedElements.length <= 0 && elements_[index]) {
            elements_.splice(index, 1)
        }

        /* regenerate tree */
        const { path, children, selectedValues } = this.getElements(0, selectedElementsAfterDelete, elements_, [], [], [])
        const selectedElements = selectedValues
        childrenElements = children
        childrenElements = this.hideElements(1, childrenElements, parseInt(this.state.maxColumns))
        childrenElements.forEach(e => {
            if (e.hidden) showBackBtn = true
        })
        /*  /regenerate tree */
        const saveItems = this.props.saveItems || false
        this.setState({ saveItems, showBackBtn, path, childrenElements, elements: elements_, selectedElements })
    }

    getElements = (pos, selected, list, result, path, selectedElements) => {
        let res = result
        let selectedValues = selectedElements
        if (typeof (selected[pos]) !== undefined) {
            const index = selected[pos]
            if (pos === 0) {
                if (list[index]) {
                    list[index].selected = true
                    res.push(list)
                    res.push(list[index].children)
                    path.push(list[index].title)
                    selectedElements.push(index)
                    return this.getElements(1, selected, list, res, path, selectedElements)
                }
                else {
                    if (selectedElements.length <= 0) {
                        res.push(list)
                        return { path, children: res, selectedValues }    
                    }
                }
            }
            else {
                selectedElements.push(index)
                if (res[pos] && res[pos][index] && res[pos][index] && res[pos][index].children.length > 0) {
                    res[pos][index].selected = true
                    res.push(res[pos][index].children)
                    path.push(res[pos][index].title)
                    return this.getElements(pos + 1, selected, list, res, path, selectedElements)
                }
            }
        }
        return { path, children: res, selectedValues }
    }

    saveItems = () => {
        const updatedElements = this.state.elements
        if (this.props.saveItems) {
            this.setState({ saveItems: false })
            this.props.saveItems(updatedElements)
        }
    }

    render() {
        const { childrenElements, selectedElements, currentValue, path, maxColumns, showBackBtn, editItems, addItems, saveItems } = this.state
        const { orientation } = this.props
        return (
            <div className='rootBrowseTree'>
                {this.props.dev && (
                <div>
                    <div><i>Edit items:  {String(editItems)}</i></div>
                    <div><i>Add items:  {String(addItems)}</i></div>
                    <br></br>
                    <div><i>Orientation:  {orientation === 'portrait' ? 'portrait' : 'landscape'}</i></div>
                    <br></br>
                    <div><i>Max Columns: {maxColumns}</i></div>
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
                {saveItems && <div className={'saveArea'}>
                    <img onClick={this.saveItems} title={'Save'} alt={'Save items'} src={save} className={'saveIcon'} />
                </div>}
                <section className='browseTree animated fadeIn'>
                    <div className='browseSubTree' style={this.layoutOrientation}>
                        {showBackBtn && (
                            <div className={'backBtnContent'}>
                                <img title={'Go back'} className={'backBtn'} onClick={this.back} src={arrowLeft} alt='Back' />
                            </div>
                        )}
                        {childrenElements.map((item, pos) => (
                            <div style={this.columnStyle} className={item.hidden ? 'columnHidden' : (item.length > 0 ? 'column' : '')} key={pos}>
                                {addItems && 
                                <div className={'interactionIcons'}>
                                    <img title={'Add new item'} alt={'Add new item'} src={plus} className={'addItem'} onClick={() => this.addItem(pos, false)} />
                                    <img title={'Add new folder'} alt={'Add new folder'} src={plusFolder} className={'addFolderItem'} onClick={() => this.addItem(pos, true)} />
                                </div>}
                                {item.map((e,i) =>
                                    <Item editItems={editItems} deleteItem={this.deleteItem} updateItem={this.updateItem} selected={selectedElements[pos]} columnPosition={pos} data={e} key={i} index={i} renderChildren={this.renderChildren} />
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