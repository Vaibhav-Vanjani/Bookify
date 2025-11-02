import { createSlice } from "@reduxjs/toolkit";

export const PriceSlice = createSlice({
    name: "price",
    initialState:{
        // id:price
    },
    reducers:{
        readBookPrice: (state,action)=>{
            console.log("inside price slice",action,state);
            if(!state[action.payload.id]){
                state[action.payload.id] = action.payload.price;
            }
        }
    }
})

export const {readBookPrice} = PriceSlice.actions;
export default PriceSlice.reducer;