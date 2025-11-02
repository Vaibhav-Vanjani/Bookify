import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
    name:"user",
    initialState:{
        isSignIn:false,
        signUpForm:false,
        loginForm:false,
        userInfo:{
            // userId:""
        }
    },
    reducers:{
        markSignIn : (state,action)=>{
            state.isSignIn = true;
        },
         markSignOut : (state,action)=>{
            state.isSignIn = false;
        },
        openSignUpForm: (state,action)=>{
            state.signUpForm = true;
        },
        openLoginForm:(state,action)=>{
            state.loginForm = true;
        },
         closeLoginForm: (state,action)=>{
            state.loginForm = false;
        },
         closeSignUpForm: (state,action)=>{
            state.signUpForm = false;
        },
        addUserInfo: (state,action)=>{
            state.userInfo = ({
                firstName:action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email,
                password: action.payload.password,
                userId:action.payload.userId,
            })
        }
    }
})


export const { markSignIn , markSignOut , openSignUpForm ,closeSignUpForm,addUserInfo ,openLoginForm , closeLoginForm} = UserSlice.actions;

export default UserSlice.reducer;