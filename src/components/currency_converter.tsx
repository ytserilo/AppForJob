import React, {FC, useMemo, useState} from 'react'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Currency } from '../store/reducers/currency';
import { validatePrice } from '../utils/validators/add_currency_validators';

// mode -> sell - це цiна по якiй ти можеш купити валюту
// mode -> buy - це цiна по якiй ти можеш продати валюту
function getPrice(name: string, mode: string, currencies: Currency[]): number{
    if(name == "UAH"){
        return 1;
    }
    let found_index = -1;
    currencies.find((item, index) => {
        if(item.name == name){
            found_index = index;
            return true;
        }
    });
    
    if(found_index == -1){
        found_index = 0;
    }

    if(mode == "sell"){
        return currencies[found_index].sell_price
    }else{
        return currencies[found_index].buy_price;
    }
}

export const CurrencyConverter: FC = function(){
    const currencies = useTypedSelector((state) => state.CurrencyReducer);
    const [ConvertTo, setConvertTo] = useState<string>("UAH");
    const [ConvertFrom, setConvertFrom] = useState<string>("USD");
    const [Amount, setAmount] = useState<number>(1);

    const convertTo_value = useMemo(() => {
        const toPrice = getPrice(ConvertTo, "sell", currencies); // UAH
        const fromPrice = getPrice(ConvertFrom, "buy", currencies); // UAH

        return fromPrice / toPrice * Amount; 
    }, [ConvertFrom, ConvertTo, Amount, currencies]);

    function setAmountHandler(e: any){
        let inputNum = Number(e.target.value);
        if(inputNum < 1){
            inputNum = 1;
        }
        e.target.value = inputNum;
        setAmount(inputNum);
    }

    return (
        <div className="currency-converter">
            <div className='convert-from'>
                <input type="number" value={Amount} onInput={setAmountHandler}/>
                <select onChange={(e) => {setConvertFrom(e.target.value)}}>
                    {
                        currencies.map((item, i) => {
                            if(item.name == ConvertFrom){
                                var option_obj = <option key={i} selected value={item.name}>{item.name}</option>;
                            }else{
                                var option_obj = <option key={i} value={item.name}>{item.name}</option>;
                            }
                            return option_obj;
                        })
                    }
                </select>
            </div>
            
            <div className='convert-to'>
                <input type="number" value={convertTo_value} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const num = Number(e.target.value);
                    const result = validatePrice(num);
                    
                    if(result.type == "error"){
                        e.target.value = convertTo_value;
                    }else{
                        setAmount(num / (convertTo_value / Amount)); 
                    }
                }}/>
                <select onChange={(e) => {setConvertTo(e.target.value)}}>
                    {
                        currencies.map((item, i) => {
                            if(item.name == ConvertTo){
                                return <option key={i} selected value={item.name}>{item.name}</option>
                            }else{
                                return <option key={i} value={item.name}>{item.name}</option>
                            }
                        })
                    }
                </select>
            </div>
        </div>
    )
}
