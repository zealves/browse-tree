import React, { Component } from 'react'
import './App.css'

import BrowseTree from './components/browseTree'

const elements = [
  {
    title: 'Opções',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Approve_icon.svg',
    value: { objectName: 'TESTE', data: [1, 2, 3, 4, 5, 6, 7, 8] },
    children: [
      {
        title: 'Opções1',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Deletion_icon.svg',
        children: [
          {
            title: 'Opções11',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Injury_icon_2.svg/1024px-Injury_icon_2.svg.png',
            children: [
              {
                title: 'Opções111',
                children: [
                  {
                    title: 'CPRR',
                    value: { id: 11, data: { test: 'CPRR', array: [1,2,3,4,5,6] } },
                    children: [
                      {
                        title: 'CPRR11111',
                        children: [
                          {
                            title: 'Cvvvvvv11111',
                            children: []
                          },
                          {
                            title: 'ggggggg22222',
                            children: [
                              {
                                title: 'aaaaaaa',
                                children: [
                                  {
                                    title: 'bbbbbbbbbbbb',
                                    children: [
                                      {
                                        title: '123123',
                                        children: [
                                          {
                                            title: '4444',
                                            children: [],
                                            value: { id: 4444, data: {test: 123, array: []}}
                                          },
                                          {
                                            title: '1111',
                                            children: [],
                                            value: { id: 1111, data: { test: 1, array: [] } }
                                          }
                                        ]
                                      },
                                      {
                                        title: '3123123',
                                        children: []
                                      }
                                    ]
                                  },
                                  {
                                    title: 'aaaaaaassssssss',
                                    children: []
                                  }
                                ]
                              },
                              {
                                title: 'sssssssssss',
                                children: []
                              }
                            ]
                          }
                        ]
                      },
                      {
                        title: 'RRRR22222',
                        children: []
                      }
                    ]
                  },
                  {
                    title: 'RRRR',
                    children: [],
                    value: { teste: 3}
                  }
                ]
              },
              {
                title: 'Opções211',
                children: []
              }
            ]
          },
          {
            title: 'Opções21',
            children: []
          }
        ]
      },
      {
        title: 'Opções2',
        children: [
          {
            title: 'OPTT',
            children: []
          },
          {
            title: 'OPTT222',
            children: [
              {
                title: 'OPTT333',
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Items',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Feed-icon.svg/1024px-Feed-icon.svg.png',
    children: []
  },
  {
    title: 'Projetos',
    image: 'https://findicons.com/files/icons/1190/agua_leopard_folders/256/projects_folder.png',
    children: [],
    value: { id: 12, data: 'Projetos' }
  },
  {
    title: 'Imagens',
    children: [
      {
        title: 'Imagens1',
        children: []
      },
      {
        title: 'Imagens2',
        children: []
      }
    ]
  }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      elements: elements,
      flag: false
    }
  }

  componentDidMount = () => {
    try {
      if (localStorage.getItem('elements') && localStorage.getItem('elements') !== '') {
        const d = JSON.parse(localStorage.getItem('elements'))
        return this.setState({ elements: d, flag: true })
      }
    } catch (err) {
      console.log('get elements Error' + err)
    }
    return this.setState({ flag: true })
  }

  onChange = (val) => {
    console.log('currentValue', val)
  }

  saveItems = (items) => {
    console.log('saveItems', items)
    localStorage.setItem('elements', JSON.stringify(items))
    this.setState({ elements: items, flag: true })
  }

  render() {
    let { elements } = this.state
    if (!this.state.flag) return ''
    return (
      <div className="App">
        <BrowseTree
          selectedElements={[0, 0, 0, 0, 0, 0, 1, 0]}
          elements={elements}
          orientation={'landscape'}
          itemMinWidth={200}
          itemMaxWidth={600}
          itemMaxHeight={400}
          maxColumns={4}
          onUpdate={this.onChange}
          editItems={true}
          addItems={true}
          saveItems={this.saveItems}
          dev={true}
          />
      </div>
    )
  }
}

export default App
