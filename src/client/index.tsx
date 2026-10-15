import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { App } from '@/containers/App'
import rootSaga from '@/sagas'
import rootReducer from '@/slices'

import '@/styles/index.scss'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: import.meta.env.DEV,
})

sagaMiddleware.run(rootSaga)

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)

