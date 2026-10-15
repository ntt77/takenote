import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createSagaMiddleware from 'redux-saga'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { App } from '@/containers/App'
import rootSaga from '@/sagas'
import rootReducer from '@/slices'
import history from '@/utils/history'

import '@/styles/index.scss'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: import.meta.env.DEV,
})

sagaMiddleware.run(rootSaga)

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
