import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'  
import Application from './App.js'
import configureSocket from './sockets.js';
import { createStore } from 'redux';
import reducer from './reducers.js';
import '../index.scss'
const store = createStore(reducer);
    
//setup socket connection
export const socket = configureSocket(store.dispatch);
    
ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('root')
);