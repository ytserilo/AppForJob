import React, {FC, useEffect, useState} from 'react';
import { useTypedSelector } from './hooks/useTypedSelector';
import { ApiAddCurrencyCreator } from './store/reducers/currency';
import { useDispatch } from "react-redux";
import { CurrencyManager } from './components/currency_manager';
import { CurrencyConverter } from './components/currency_converter';
import OpenIcon from "./media/images/gear-solid.svg";
import CloseIcon from "./media/images/xmark-solid.svg";
import "./media/css/main.css"

const App: FC = () => {
  const [CurrenciesLoadStatus, setCurrenciesLoadStatus] = useState<boolean>(false);
  const [CurrencyManagerOpen, setCurrencyManagerOpen] = useState<boolean>(false);

  const currencies = useTypedSelector(state => state.CurrencyReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ApiAddCurrencyCreator());
  }, []);
  useEffect(() => {
    
    if(currencies.length > 1){
      setCurrenciesLoadStatus(true);
    }
  }, [currencies])

  function CurrencyManagerToggle(e: any){
    setCurrencyManagerOpen(!CurrencyManagerOpen);
  }

  return (
    <React.Fragment>
        {
          CurrenciesLoadStatus
          ? <React.Fragment>
              <header>
                {
                  currencies.filter((item) => item.main).map((item, i) => {
                    return <div className="main_currency" key={i}>
                      <span className='currency_name'>{item.name}</span>
                      <span className='currency_price'>{item.buy_price}</span>
                    </div>
                  })
                }
              </header>
              <CurrencyConverter />
              <CurrencyManager open={CurrencyManagerOpen}/>
              <button className='currency-manager__toggle-button' onClick={CurrencyManagerToggle}>
                {
                  CurrencyManagerOpen
                  ? <img src={CloseIcon} />
                  : <img src={OpenIcon} />
                }
              </button>
            </React.Fragment>
          : <div>
            Loading...
          </div> 
        }
        
    </React.Fragment>
  );
}

export default App;
