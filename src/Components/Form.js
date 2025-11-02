import { useNavigate,Route,Routes, Outlet, useLocation } from "react-router-dom";
import MainHeader from "../Pages/MainHeader";
import Cart from "../Pages/Cart";
import Home from '../Pages/Home';
import '../App.css'
import bookicon from '../assets/bookicon.jpg';
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {closeSignUpForm, markSignIn, markSignOut, openSignUpForm ,openLoginForm ,closeLoginForm, addUserInfo} from "../Slice/UserSlice";
import BookInfo from "../Pages/BookInfo";
import Order from "../Pages/Order";
import { useFirebase } from "../Context/FirebaseContext";
import ImageSlider from "../Components/ImageSlider"; 
import {markAdminSignIn} from '../Slice/AdminSlice.js'

export default function Form(){
     const location = useLocation();
    //  console.log("Form location",location);
    const adminRoute = location.pathname.includes('/admin');
    const navigate = useNavigate();
    const [user,setUser] = useState(false);
    const state = useSelector((state)=>state.counter);
    const userInfo = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const [formData,setFormData] = useState({firstName:"",
        lastName:"",
        email:"",
        password:""
    });

    function formHandler(e){
        let {name,type,value} = e.target;
        value = value.trim();
        console.log('value',value);
        setFormData(prev=>{return {...prev,[name]:value}});
    }

    const firebase = useFirebase();
    // console.log("firebase",firebase);
    // console.log("userInfo",userInfo);

    return (<>
        { (!!adminRoute || !!userInfo.signUpForm || !!userInfo.loginForm) &&
       <section class="form-section">
        <form class="form-container" 
                onSubmit={(e)=>
                            {e.preventDefault(); 

                              if(formData?.password?.length<6){
                                  return alert('Length of Password should be greater than 6 !!');
                              }
                              
                              if(userInfo.signUpForm && formData?.firstName?.trim().length<2){
                                return alert("Length of first name should be greater than 2 !!");
                              }

                              if(userInfo.signUpForm && formData?.lastName?.trim().length<2){
                                return alert("Length of last name should be greater than 2 !!");
                              }

                              if(!formData?.email.includes('@') || !formData?.email.includes('.')){
                                  return alert('Please type correct email !!');
                              }

                              if(formData?.firstName.includes('@') || 
                                  formData?.firstName.includes('.') ||
                                   formData?.firstName.includes('#') ||
                                   formData?.firstName.includes('!') ||
                                   formData?.firstName.includes('$')
                                  ){
                                  return alert('Please Avoid special character !!');
                              }

                                if(formData?.lastName.includes('@') || 
                                  formData?.lastName.includes('.') ||
                                   formData?.lastName.includes('#') ||
                                   formData?.lastName.includes('!') ||
                                   formData?.lastName.includes('$')
                                  ){
                                  return alert('Please Avoid special character !!');
                              }

                             if(userInfo.signUpForm){
                                firebase.logout();
                                firebase.signup(formData.email,formData.password).then((response)=>{
                                  console.log(response,"signup");
                                  if("FAILURE" != response){
                                    console.log("user",response?.user);
                                        const insertUser = firebase.insertInDB('/user/'+response?.user?.uid,{
                                          firstName:formData?.firstName,
                                          lastName:formData?.lastName,
                                          email:formData?.email,
                                          createdAt:Date.now(),
                                          profileImageLink:"",
                                        })

                                        // console.log("insertUser",insertUser);

                                        if("FAILURE"===insertUser){
                                            console.log("insert in firebase failed");
                                            return alert("Something went wrong while signing you in !!");
                                        }

                                        dispatch(closeSignUpForm()); 
                                        setUser(true); 
                                        dispatch(markSignIn())
                                        dispatch(addUserInfo({
                                          firstName:formData?.firstName,
                                          lastName:formData?.lastName,
                                          email:formData?.email,
                                          userId:response?.user?.uid,
                                        }));
                                        setFormData({firstName:"",
                                        lastName:"",
                                        email:"",
                                        password:""
                                    })
                                       
                                  }
                                  else{
                                    console.log(response,"signuo");
                                     return alert("Something went wrong while signing you in !!");
                                  }
                                   
                                })
                                .catch((error)=>{
                                    console.log("catch signup",error);
                                  return alert("Something went wrong while signing you in !!",error);
                                })
                             } 

                              if(userInfo.loginForm){
                                firebase.logout();
                                firebase.login(formData.email,formData.password).then((response)=>{
                                  console.log("response loggin",response)
                                  if("FAILURE" != response){
                                    dispatch(closeLoginForm());
                                        
                                    const getUser = firebase.getDataFromDB('/user/'+response?.user?.uid)

                                        console.log("getUser",getUser);
                                    getUser.then((res)=>{
                                        setUser(true); 
                                        dispatch(markSignIn());
                                        dispatch(addUserInfo({
                                            firstName:res?.data?.firstName,
                                            lastName:res?.data?.lastName,
                                            email:res?.data?.email,
                                            userId:response?.user?.uid,
                                            }));
                                        setFormData({firstName:"",
                                        lastName:"",
                                        email:"",
                                        password:""
                                    })
                                    })
                                    .catch((error)=>{
                                        return alert("Please check your credential !!"+ error);
                                    })
                                       
                                  }
                                  else{
                                     return alert("Please check your credential !!");
                                  }
                                })
                                .catch((error)=>{
                                    return alert("Please check your credential !!");
                                })
                             } 

                             if(adminRoute){
                                firebase.getDataFromDB('/admin').then((response)=>{
                                  // console.log("response admin",response)
                                  if(response){
                                      for (const key in response) {
                                         const {email,password} = response;
                                         if((formData.email === email) && (formData.password == password)){
                                            dispatch(closeLoginForm());
                                            navigate('/admin/section');
                                            dispatch(markAdminSignIn());
                                            return;
                                         }
                                      }
                                     
                                         return alert("Please check your credential !!");
                                   
                                  }
                                  else{
                                     return alert("Please check your credential !!");
                                  }
                                })
                                .catch((error)=>{
                                    return alert("Please check your credential !!");
                                })
                             } 
            }}>
          <span class="form-close" onClick={()=>{dispatch(closeSignUpForm()); dispatch(closeLoginForm());  }}>×</span>
          { (!!userInfo.signUpForm && !adminRoute) &&
          <div class="form-name-fields">
            <input name="firstName" value={formData.firstName} type="text" placeholder="First Name" required onChange={formHandler}/>
            <input name="lastName" value={formData.lastName}  type="text" placeholder="Last Name" required onChange={formHandler}/>
          </div>
          }
          <input name="email" value={formData.email}  type="email" placeholder="Email" required onChange={formHandler}/>
          <input name="password" value={formData.password} type="password" placeholder="Password" required onChange={formHandler}/>
          
          <button type="submit" class="form-submit-btn">{(!!userInfo.signUpForm && !adminRoute) ? `Sign Up` : `Log In`}</button>
        </form>
      </section>}
    </>)
}