import { createStore } from 'redux'
import { default as rootReducer } from '../reducers/index.js'

const store = createStore(rootReducer)

export default store
