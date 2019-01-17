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
                    children: []
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
{/*
  selectedElements={ [0, 0, 0, 0, 1] }
*/}
class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowseTree
          selectedElements={[ 0, 0, 0, 0 ]}
          elements={elements}
          maxColumns={9999} />
      </div>
    )
  }
}

export default App
