import { createSlice } from "@reduxjs/toolkit";

export const AdminSlice = createSlice({
    name: "admin",
    initialState:{
        userOrderDetail : [
            // {
            // orderId:"",
            // userId:"",
            // }
        ],
        newlyAddedBook:[],
        isSignIn:false,
    },
    reducers:{
        addOrderUserIds: (state,action)=>{
            state.userOrderDetail.push({orderId:action.payload.orderId,userId:action.payload.userId});
        },
        removeFromNewlyAddedBookCart: (state,action)=>{
            console.log(state.newlyAddedBook,"newlyAddedBook in admin slice")
           const isBookPresent = state.newlyAddedBook.findIndex((item)=>item.id === action.payload);
           if(isBookPresent !== -1){
            state.newlyAddedBook.splice(isBookPresent,1);
           }
        },
        updateNewlyAddedBookCart: (state,action)=>{
           state.newlyAddedBook = [...action.payload];
           console.log(state.newlyAddedBook,"state.newlyAddedBook");
        },
        markAdminSignIn: (state,action)=>{
            state.isSignIn = true;
        },
    }
})

export const { addOrderUserIds ,removeFromNewlyAddedBookCart, updateNewlyAddedBookCart , markAdminSignIn} = AdminSlice.actions;

export default AdminSlice.reducer;