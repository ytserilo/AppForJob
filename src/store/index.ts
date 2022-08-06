import {applyMiddleware, combineReducers, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import { CurrencyReducer } from "./reducers/currency";
import { rootWatcher } from "./saga";


const rootReducer = combineReducers({
    CurrencyReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const saga_middlware = createSagaMiddleware()

export const store = createStore(rootReducer, applyMiddleware(saga_middlware));

saga_middlware.run(rootWatcher);