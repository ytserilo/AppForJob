import React, {FC, useState, useRef} from 'react'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useDispatch } from "react-redux";
import { addCurrencyCreator, Currency, removeCurrencyCreator } from '../store/reducers/currency';
import { validateName, validatePrice } from '../utils/validators/add_currency_validators';
import SuccessIcon from "../media/images/check-solid.svg";

interface CurrencyManagerInterface {
    open: boolean
}

export const CurrencyManager:FC<CurrencyManagerInterface> = (props: CurrencyManagerInterface) => {
    const [Mode, setMode] = useState<string>("add");
    

    function ChooseModeHandler(){
        if(Mode == "add"){
            setMode("remove");
        }
        else{
            setMode("add");
        }
    }

    return (
        <div className={
            props.open
            ? "currency-manager currency-manager_open"
            : "currency-manager currency-manager_close"
        }>
            {
                Mode == "add"
                ? <AddCurrencyComponent />
                : <RemoveCurrencyComponent />
            }
            <div className='currency-manager__mode-block'>
                <span>Choose Mode</span>
                <select onChange={ChooseModeHandler}>
                    <option value="add">Add</option>
                    <option value="remove">Remove</option>
                </select>
            </div>
            
        </div>
    )
}

interface CurrencyErrors{
    name: string | undefined;
    buy_price: string | undefined;
    sell_price: string | undefined;
}

function AddCurrencyComponent(){
    const [CurrencyData, setCurrencyData] = useState<Currency>({
        name: "",
        buy_price: 0,
        sell_price: 0,
        main: false
    });
    const [Errors, setErrors] = useState<CurrencyErrors>({
        name: undefined,
        buy_price: undefined,
        sell_price: undefined
    });
    const currencyModalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    function setCurrencyName(e: React.ChangeEvent<HTMLInputElement>){
        const name = e.target.value;
        const result = validateName(name);

        if(result.type == "success"){
            setCurrencyData({...CurrencyData, name: name});
        }
        setErrors({...Errors, name: result.message});
    }

    function setBuyPrice(e: React.ChangeEvent<HTMLInputElement>){
        const num = Number(e.target.value);
        const result = validatePrice(num);

        if(result.type == "success"){
            setCurrencyData({...CurrencyData, buy_price: num});
        }
        setErrors({...Errors, buy_price: result.message});
    }

    function setSellPrice(e: React.ChangeEvent<HTMLInputElement>){
        const num = Number(e.target.value);
        const result = validatePrice(num);

        if(result.type == "success"){
            setCurrencyData({...CurrencyData, sell_price: num});
        }
        setErrors({...Errors, sell_price: result.message});
    }

    function AddCurrencyHandler(e: React.MouseEvent){
        let name = validateName(CurrencyData.name);
        let buy_price = validatePrice(CurrencyData.buy_price);
        let sell_price = validatePrice(CurrencyData.sell_price);

        let error_count = 0;
        if(name.type == "error"){
            error_count += 1;
        }
        if(buy_price.type == "error"){
            error_count += 1;
        }
        if(sell_price.type == "error"){
            error_count += 1;
        }

        if(error_count > 0){
            setErrors({
                name: name.message,
                buy_price: buy_price.message,
                sell_price: sell_price.message
            });
            return;
        }

        dispatch(addCurrencyCreator([CurrencyData]));
        currencyModalRef.current?.setAttribute(
            "class",
            "currency-manager__add-modal currency-manager__modal_open"  
        );
        const parent = currencyModalRef.current?.parentElement;
            const inputs = parent?.querySelectorAll("input");
            for(let i = 0; i < inputs?.length; i++){
                inputs[i].value = "";
        }
        setTimeout(() => {
            currencyModalRef.current?.setAttribute(
                "class",
                "currency-manager__add-modal"  
            );
        }, 2000);
    }

    return <React.Fragment>
        <div ref={currencyModalRef} className='currency-manager__add-modal'>
            <img src={SuccessIcon} />
            <span>Success</span>
        </div>
        <div>
            <label>Currency name</label>
            <input type="text" onInput={setCurrencyName}/>
            {
                Errors.name
                ? <span className='error-message'>{Errors.name}</span>
                : undefined
            }
            
        </div>
        <div>
            <label>Buy price</label>
            <input type="number" onInput={setBuyPrice}/>
            {
                Errors.buy_price
                ? <span className='error-message'>{Errors.buy_price}</span>
                : undefined
            }
        </div>
        <div>
            <label>Sell price</label>
            <input type="number" onInput={setSellPrice}/>
            {
                Errors.sell_price
                ? <span className='error-message'>{Errors.sell_price}</span>
                : undefined
            }
        </div>
        <button style={{marginBottom: "60px"}} onClick={AddCurrencyHandler}>Add</button>
    </React.Fragment>
}


type selectedForRemove = false | string;
function RemoveCurrencyComponent(){
    const removeModelCurrencyRef = useRef<HTMLInputElement>(null);
    const removeCurrencySelect = useRef<HTMLSelectElement>(null);
    const currencies = useTypedSelector((state) => state.CurrencyReducer);
    const dispatch = useDispatch();
    const [Selected, setSelected] = useState<selectedForRemove>(false);
    const [removeError, setRemoveError] = useState<selectedForRemove>(false);

    function RemoveCurrency(e: React.ChangeEvent<HTMLSelectElement>){
        const currencyName = e.target.value;
        if(currencyName != ""){    
            if(currencies.length == 1){
                setRemoveError("You cannot delete the last currency");
                return;
            }
            else{
                setRemoveError(false);
            }

            setSelected(currencyName);
            removeModelCurrencyRef.current?.setAttribute(
                "remove-currency-name", 
                currencyName
            )
        }
    }

    return <React.Fragment>
        <div className="currency-manager__remove-modal" style={{
            transform: Selected ? "translateX(0)": "translateX(100%)"
        
        }}>
            <span>Do you want to delete currency "{Selected}"</span>
            <div className='remove-modal__buttons'>
                <button ref={removeModelCurrencyRef} onClick={(e) => {
                    const name = e.target.getAttribute("remove-currency-name");
                    
                    dispatch(removeCurrencyCreator(name));
                    setSelected(false);
                    removeCurrencySelect.current.selectedIndex = 0;
                }}>Yes</button>
                <button onClick={(e) => {
                    removeCurrencySelect.current.selectedIndex = 0;
                    setSelected(false);
                }}>No</button>
            </div>
        </div>
        <select ref={removeCurrencySelect} className='currency-manager__remove-select' onChange={RemoveCurrency}>
            {
                [{ name: "Default" }].concat(currencies).map((item, i) => {
                    if(item.name == "Default"){
                        return <option hidden key={i}>Choose currency</option>
                    }
                    return <option key={i} value={item.name}>{item.name}</option>
                })
            }
        </select>
        {
            removeError
            ? <span className='error-message'>{removeError}</span>
            : undefined
        }
    </React.Fragment>
}