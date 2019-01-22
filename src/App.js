import React, { Component, Suspense, lazy } from 'react'
import './App.css'

//import BrowseTree from './components/browseTree'

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
const EventEmitter = {
  events: {}, // dictionary with our events
  on(event, listener) { // add event listeners
    if (!this.events[event]) { this.events[event] = { listeners: [] } }
    this.events[event].listeners.push(listener);
  },
  off(event) { // remove listeners
    delete this.events[event]
  },
  emit(name, ...payload) { // trigger events

    if (!this.events[name]) return false

    for (const listener of this.events[name].listeners) {
      listener.apply(this, payload)
    }
  }
}

EventEmitter.on('login', ({ user, pass }) => {
  console.log('login', user, pass)
});

EventEmitter.on('dog', (name, color, race) => console.log('dog', name, color, race));


const BrowseTree = lazy(() => import('./components/browseTree'))

class App extends Component {

  componentDidMount = () => {
    EventEmitter.emit('login', { user: 'admin', pass: 'teste123' });
  }
  
  onChange = (val) => {
    console.log(val)
  }

  loadingMessage = () => (
    <h1>"I'm loading..."</h1>
  )

  render() {
    return (
      <div className="App">
      <Suspense fallback={this.loadingMessage}>
        <BrowseTree
          selectedElements={[0, 0, 0, 0, 0, 0, 1, 0]}
          elements={elements}
          orientation={'landscape'}
          itemMinWidth={200}
          itemMaxWidth={600}
          maxColumns={4}
          onUpdate={this.onChange}
          dev={true}
          />
        </Suspense>
      </div>
    )
  }
}

export default App
