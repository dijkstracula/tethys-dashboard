import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';

const loggerMiddleware = createLogger();
const store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
);

export default store;