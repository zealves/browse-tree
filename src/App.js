import React, { Component } from 'react'
import './App.css'

import BrowseTree from './components/browseTree'

const elements = [
  {
    title: 'Opções',
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
                                            children: []
                                          },
                                          {
                                            title: '1111',
                                            children: []
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
    title: 'Definições',
    children: []
  },
  {
    title: 'Projetos',
    children: []
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
  render() {
    return (
      <div className="App">
        <BrowseTree
          selectedElements={[ 0, 19, 0 ]}
          elements={elements}
          maxColumns={10} />
      </div>
    )
  }
}

export default App
