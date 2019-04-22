import React from 'react'
import {render} from 'react-dom'
import App from './components/App/App'
import {Provider} from 'react-redux'
import {store} from "./redux/Store";
import {Action} from "./redux/Action";





// Now we can render our application into it
render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
