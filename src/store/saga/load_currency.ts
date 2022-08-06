import {takeEvery, put, call} from "redux-saga/effects";
import { addCurrencyCreator, API_ADD_CURRENCY_ACTION, Currency } from "../reducers/currency";

function toNumber(num: string): number{
    return Math.round(Number(num) * 1000) / 1000;
}

function parseCurrencies(data: any): Currency[]{
    let currencyArray: Currency[] = [];
    for(let i = 0; i < data.length; i++){
        const name: string = data[i].ccy;
        const buy_price: number = toNumber(data[i].buy);
        const sell_price: number = toNumber(data[i].sale);

        currencyArray.push({ name, buy_price, sell_price, main: true });
    }

    return currencyArray;
}

function InitCurrencyData(url: string): Promise<Currency[]>{
    return new Promise((resolve) => {
        fetch(url).then((data) => {
            data.json().then((data) => {
                resolve(parseCurrencies(data));
            }).catch((e) => {resolve([])});

        }).catch((e) => {resolve([])})
    });
}

function* currencyWorker(){
    const currencies: Currency[] = yield call(
        InitCurrencyData, "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
    );
    yield put(addCurrencyCreator(currencies));
}

export function* loadCurrencyWatcher(){
    yield takeEvery(API_ADD_CURRENCY_ACTION, currencyWorker);
}
