import { useEffect, useRef, useState } from "react";
import '../Css/Order.css'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addOrderUserIds } from "../Slice/AdminSlice";
import Bookcard from "../Components/BookCard";
import { useNavigate } from "react-router-dom";
import { refreshCart } from "../Slice/CounterSlice";
import Form from "../Components/Form";
import Navbar from "../Components/Navbar";
import { useFirebase } from "../Context/FirebaseContext";

function Checkmark({ size = 100 }) {
  return (
    <svg
      viewBox="0 0 52 52"
      width={size}
      height={size}
      className="checkmark-svg"
    >
      <circle
        className="checkmark__circle"
        cx="26"
        cy="26"
        r="25"
        fill="none"
      />
      <path
        className="checkmark__check"
        fill="none"
        d="M14 27 L22 34 L38 16"
      />
      <h2>Success!</h2>
    </svg>
  );
}

export default function Order(){

    const [successLogo,setSuccessLogo] = useState(true);
    const user = useSelector((state)=>state.user);
    const cart = useSelector((state)=>state.counter);
    const refCart = useRef(cart);
    const [orderUserInfo,setOrderUserInfo] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const firebase = useFirebase();
    
    useEffect(()=>{
        setTimeout(()=>{
            setSuccessLogo(false);
            const idsInfo = 
            {
              orderId:Date.now(),
              userId: user?.userInfo?.userId,
            };

            firebase.insertInDB('/order-user/'+Date.now(),{
              userId:idsInfo.userId,
              orderId:idsInfo.orderId,
            })

            refCart.current.forEach((item,index) => {
              firebase.insertInDB('/orders/'+idsInfo.orderId +'/'+(index+1),{
              itemid:item.book.id,
              count:item.count,
              price:item.price,
              createdAt:Date.now(),
            })
            });       

            dispatch(refreshCart());
            setOrderUserInfo(idsInfo)
            dispatch((addOrderUserIds(idsInfo)))
        },2000)
    },[])

    return <>
        <Form></Form>
        <Navbar></Navbar>
        {/* <div className={successLogo ? "hide" : "Show"}> Order id</div> */}
        {!!user.isSignIn && <> 
            <div className={"order-success-svg-wrapper" + ((successLogo) ? " Show" : " hide")}>
              <Checkmark size={120} />
              <h2>Success!</h2>
            </div>
            <h1 className={successLogo ? "hide" : "Show order-summary-heading"} > Order Summary : #{orderUserInfo.orderId}</h1>
            <div className={successLogo ? "hide" : "Show"}>
            {
                refCart.current.map((item)=><Bookcard key={item.book.id} book={item.book}></Bookcard>)
            }
            </div>
        </>}
        <div style={{display: "flex",
                    justifyContent: "center",
                     position: "sticky",
                      bottom: "1rem",
                      zIndex: "200"}}>
          <button  className={successLogo ? "hide" : "Show shop-more-btn"} onClick={()=>{navigate("/"); dispatch(refreshCart())}}>Shop More</button>
        </div>
    </>
}