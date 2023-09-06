import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer'
import messageReducer from './messageReducer'
import callReducer from './callReducer'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import responsiveReducer from './responsiveReducer'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['call'],
}

const rootReducer = combineReducers({
  user: userReducer,
  message: messageReducer,
  call: callReducer,
  responsive: responsiveReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
})

export const persistor = persistStore(store)
