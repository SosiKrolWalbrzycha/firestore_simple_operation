import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Poprawny import

// Importuj swoje reducery
import itemsReducer from './itemsReducer';

const rootReducer = combineReducers({
  // Tutaj dodajesz swoje reducery
  orders: itemsReducer,
  transactions: itemsReducer,
  dailyExchangeRates: itemsReducer, 
});

// Tworzenie store z middleware thunk
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Użycie thunk bez composeWithDevTools
);

export default store;