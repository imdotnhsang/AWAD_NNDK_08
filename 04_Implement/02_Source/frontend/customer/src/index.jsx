import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import styled, { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import theme from './theme'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import rootReducer from './reducers'
import 'bootstrap/dist/css/bootstrap-grid.min.css'

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)))

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast-container {
    width: max-content;
  }
  .Toastify__toast {
    min-height: 55px;
    width: max-content;
    padding: 0;
  }
  .Toastify__toast-body {
    padding: 0;
    margin: 0;
  }
  .Toastify__toast--default {
    background-color: ${(props) => props.theme.blackMedium};
  }
  
  .Toastify__progress-bar--default {
    background: #fff;
  }
  .Toastify__progress-bar {
    height: 3px;
  }
`

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <StyledToastContainer
        autoClose={60000}
        closeButton={false}
      />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
