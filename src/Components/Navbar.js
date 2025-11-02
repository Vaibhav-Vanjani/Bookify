import { useNavigate,Route,Routes, Outlet, useLocation } from "react-router-dom";
import MainHeader from "../Pages/MainHeader";
import Cart from "../Pages/Cart";
import Home from '../Pages/Home';
import '../App.css'
import bookicon from '../assets/bookicon.jpg';
import { FaShoppingCart } from "react-icons/fa";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {closeSignUpForm, markSignIn, markSignOut, openSignUpForm ,openLoginForm ,closeLoginForm, addUserInfo} from "../Slice/UserSlice";
import BookInfo from "../Pages/BookInfo";
import Order from "../Pages/Order";
import { useFirebase } from "../Context/FirebaseContext";
import ImageSlider from "../Components/ImageSlider";
import { refreshCart } from "../Slice/CounterSlice";
import Loading from "./Loading";

export default function Navbar(){

    const [loading,setLoading] = useState(false);
    const location = useLocation();
    const searchRef = useRef({isFirstCall:true,timeoutId:""});
    console.log("Form location",location);
    const adminRoute = location.pathname.includes('/admin');
    const orderRoute = location.pathname.includes('/order');
    const navigate = useNavigate();
    // const [user,setUser] = useState(false);
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

    function handleBookSearch(event){
      if(searchRef.current.isFirstCall){
       setLoading(true);
       searchRef.current.isFirstCall = false;
      }
      clearTimeout(searchRef.current.timeoutId);
       searchRef.current.timeoutId = setTimeout(()=>{
        if(event.target.value){
          navigate(`/bookSearch/${event.target.value}`);
        }
        else{
          navigate(`/`);
        }
        searchRef.current.isFirstCall = true;
        setLoading(false);
      },2000); 
    }

    const firebase = useFirebase();
    console.log("firebase",firebase);
    console.log("userInfo",userInfo);


    return (
    <>{loading ? <div className="search-loading-container"><div className="search-loading-container-box"><Loading/></div></div> : <></>}
    <header className="header">
        <nav className="header__navbar" role="navigation" aria-label="Main navigation">

          {/* Logo / Home */}
          <ul className="header__ul header__ul--left">
            <li
              className="header__li header__logo"
              onClick={() => navigate("/")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if(e.key === 'Enter') navigate("/"); }}
              aria-label="Go to homepage"
            >
              {/* Replace with your logo img or svg */}
              <img src={bookicon} alt="Site Logo" className="header__logo-img" />
            </li>
          </ul>

          {/* Search */}
          <ul className="header__ul header__ul--center">
  <li className="header__li header__search-li">
    <input
      type="search"
      placeholder="Search"
      aria-label="Search books"
      className="header__search-input"
      onChange={handleBookSearch}
    />
    {/* <button className="header__search-btn" aria-label="Search">
      Search
    </button> */}
  </li>
</ul>


          {/* User actions */}
          <ul className="header__ul header__ul--right">
            <li className="header__li header__actions">
              {!userInfo.isSignIn &&
               <button className="btn btn--signup" 
                 onClick={()=>{
                   setFormData({firstName:"",
                                        lastName:"",
                                        email:"",
                                        password:""
                                    })
                   dispatch(openSignUpForm());
                  }}
              >Signup</button> }
              {
              !userInfo.isSignIn &&
              <button className="btn btn--signup" 
                 onClick={()=>{
                   setFormData({firstName:"",
                                        lastName:"",
                                        email:"",
                                        password:""
                                    })
                   dispatch(openLoginForm());
                  }}
              >Login</button>}
              {!orderRoute && <span
                className="header__cart"
                onClick={() => navigate("/cart")}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => { if(e.key === 'Enter') navigate("/cart"); }}
                aria-label="Go to cart"
              >
                <FaShoppingCart style={{fontSize:"2rem",}}/>
                {state.length>0 && <span className="header__cart-size">{state.length}</span>} 
              </span>}
              {
              userInfo.isSignIn && <div className="profile-dropdown-container">
                <span className="header__profile">Profile ▾</span>
                
                <div className="profile-dropdown">
                  {/* <div className="profile-dropdown__item"><strong>{userInfo.fir} UserName</strong></div> */}
                  {/* <div className="profile-dropdown__item"> */}
                     <img src={bookicon} className="profile-dropdown__item-img"/>
                  {/* </div> */}
                  <div className="profile-dropdown__item">{userInfo?.userInfo?.firstName + " " + userInfo?.userInfo?.lastName}</div>
                  {/* <div className="profile-dropdown__item">{userInfo?.userInfo?.email}</div> */}
                 
                  <button className="profile-dropdown__logout-btn" onClick={()=>{
                    dispatch(markSignOut()); firebase.logout(); navigate("/")}}>
                    Logout
                  </button>
                </div>
              </div>
          }
            </li>
          </ul>

        </nav>
      </header>
    </>)
}