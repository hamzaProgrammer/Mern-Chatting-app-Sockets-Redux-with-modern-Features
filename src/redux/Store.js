import {configureStore , getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux";
import { persistReducer } from 'redux-persist'

// importing reducers
import usersReducer from './reducers/UsersReducers'

import  persistStore from 'redux-persist/es/persistStore'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}


    // combining all reducers

const rootReducer = combineReducers({usersReducer})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        serializableCheck: false,
    })
});

let persistor = persistStore(store)

export default store;
export {persistor}
