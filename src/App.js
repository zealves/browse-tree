import React, { Component } from 'react'
import './App.css'

import BrowseTree from './components/browseTree'

const elements = [
  {
    title: 'Opções',
    value: { id: 122, data: 'Opções' },
    children: [
      {
        title: 'Opções1',
        children: [
          {
            title: 'Opções11',
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
                    children: []
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
    children: []
  },
  {
    title: 'Projetos',
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

/*
  PROPS:
  selectedElements={[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}  =>  OPTIONAL  path of selected elements by position
  elements={elements}  => REQUIRED  all data in specific format
  orientation={'landscape'} => OPTIONAL 'landscape' or 'portrait', by default landscape
          itemMinWidth={200} => OPTIONAL by default 115
          itemMaxWidth={600} => OPTIONAL by default 600
          maxColumns={4} => OPTIONAL by default false
          dev={true} => REMOVE
*/

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowseTree
          selectedElements={[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}
          elements={elements}
          orientation={'landscape'}
          itemMinWidth={200}
          itemMaxWidth={600}
          maxColumns={4}
          dev={true} />
      </div>
    )
  }
}

export default App
