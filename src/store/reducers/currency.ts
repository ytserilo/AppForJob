export type Currency = {
    name: string;
    buy_price: number;
    sell_price: number;
    main: boolean;
}

interface CurrencyReducerAction{
    type: string,
    payload: any
}

const defaultCurrenciesState: Currency[] = [
    {
        name: "UAH",
        buy_price: 1.0,
        sell_price: 1.0,
        main: true
    }
];

const ADD_CURRENCY_ACTION = "ADD_CURRENCY_ACTION";
const REMOVE_CURRENCY_ACTION = "REMOVE_CURRENCY_ACTION";
export const API_ADD_CURRENCY_ACTION = "APP_ADD_CRRENCY_ACTION";

export const CurrencyReducer = function(state: Currency[] = defaultCurrenciesState, action: CurrencyReducerAction): Currency[]{
    switch(action.type){
        case ADD_CURRENCY_ACTION:
            return state.concat(action.payload);
        case REMOVE_CURRENCY_ACTION:
            return removeCurrency(state.slice(), action.payload);
    }
    return state;
}

function removeCurrency(state: Currency[], name: string): Currency[]{
    for(let i = 0; i < state.length; i++){
        const currency_obj = state[i];
        
        if(currency_obj.name == name){
            state.splice(i, 1);
            break;
        }
    }
    
    return state;
}

export const addCurrencyCreator = function(payload: Currency[]): CurrencyReducerAction{
    return {
        type: ADD_CURRENCY_ACTION,
        payload: payload
    }
}
export const removeCurrencyCreator = function(name: string): CurrencyReducerAction{
    return {
        type: REMOVE_CURRENCY_ACTION,
        payload: name
    }
}

export const ApiAddCurrencyCreator = function(): CurrencyReducerAction{
    return {
        type: API_ADD_CURRENCY_ACTION,
        payload: false
    }
}