import { createSlice } from "@reduxjs/toolkit";

export const CounterSlice = createSlice({
    name:"counter",
    initialState:[],
    reducers:{
        increment: (state,action)=>{
        console.log("state increment ",state);
        console.log("book increment",action.payload);
        
       const index = state.findIndex((book)=>{
                if(book.book.id === action.payload.book.id){
                    return true;
                }
                return false;
            });

        if(index !==-1){
            state.splice(index,1);
        }

        console.log("state afyer ",state);
        console.log("book afyer",action.payload);

        state.push({book:action.payload.book,
                    count:action.payload.count,
                    price:action.payload.price});
        
        state.sort((a,b)=>a.book.id-b.book.id);
        },
        decrement: (state,action)=>{
         console.log("state decrement ",state);
        console.log("book decrement",action.payload);
        const index = state.findIndex((book)=>{
                if(book.book.id === action.payload.book.id){
                    return true;
                }
                return false;
            });

        if(index !==-1){
            state.splice(index,1);
        }

           action.payload.count>0 && state.push(
                    {book:action.payload.book,
                    count:action.payload.count,
                    price:action.payload.price});
            state.sort((a,b)=>a.book.id-b.book.id);
        },
        refreshCart: (state,action)=>{
            state.splice(0,state.length);
        }
    }
})

export const {increment,decrement,refreshCart} = CounterSlice.actions;

export default CounterSlice.reducer;