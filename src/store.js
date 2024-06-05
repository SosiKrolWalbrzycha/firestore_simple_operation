import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';


// Importuj swoje reducery
import itemsReducer from './itemsReducer';

const rootReducer = combineReducers({
  // Tutaj dodajesz swoje reducery
  orders: itemsReducer,
  transactions: itemsReducer,
  dailyExchangeRates: itemsReducer, 
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
  applyMiddleware(thunk)// Umożliwia korzystanie z Redux DevTools i thunk
 
));

export default store;