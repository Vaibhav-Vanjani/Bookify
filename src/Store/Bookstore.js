import {configureStore} from '@reduxjs/toolkit';
import CounterReducer from '../Slice/CounterSlice';
import UserReducer  from '../Slice/UserSlice';
import  AdminReducer  from '../Slice/AdminSlice';
import  PriceReducer  from '../Slice/PriceSlice';


const Bookstore = (
    configureStore({
        reducer: {
                counter: CounterReducer,
                user: UserReducer,
                admin:AdminReducer,
                price:PriceReducer,
            }
        }
    )
)

export default Bookstore;