import { all } from "redux-saga/effects";
import { loadCurrencyWatcher } from "./load_currency";


export function* rootWatcher(){
    yield all([
        loadCurrencyWatcher()
    ])
}