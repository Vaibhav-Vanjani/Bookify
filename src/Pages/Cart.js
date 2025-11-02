import { useSelector } from "react-redux"
import Bookcard from "../Components/BookCard";
import { useNavigate } from "react-router-dom";
import '../Css/Cart.css'
import { useDispatch } from "react-redux";
import {openSignUpForm} from "../Slice/UserSlice";
import Form from "../Components/Form";
import Navbar from "../Components/Navbar";
export default function Cart(){

    const booksInCart = useSelector((state)=>state.counter);
    const userInfo = useSelector((state)=>state.user); 
    console.log("cart userInfo",userInfo);
    const dispatch = useDispatch();
    console.log("bookInCart",booksInCart);
    const navigate = useNavigate();

    return (<>
            <Form></Form>
            <Navbar></Navbar>
        {
            booksInCart?.length ?
            (
                <>
                  <div className="book-cart-container">
                    {
                        booksInCart.map((book)=>{
                            return (
                               <Bookcard key={book.id} book={book.book} bookKeyName={"Cart"}></Bookcard>
                            )
                        }
                        )
                    }
                  </div>

                   <div className="cart-summary">
                    <div className="cart-summary__subtotal">
                        Subtotal: ₹{(booksInCart.reduce((total, curr) => total + curr.price * curr.count, 0)).toFixed(2)}
                    </div>
                    <button className="cart-summary__checkout-btn" 
                        onClick={()=>{
                            if(userInfo.isSignIn){
                                navigate("/cart/order");
                            }
                            else{
                                dispatch(openSignUpForm());
                            }
                        }}
                    >Checkout</button>
                    </div>
      
                </>
            )
            :
            (
            <div className="empty-cart-container">
            <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" // Free empty cart icon
                alt="Empty Cart"
                className="empty-cart-image"
            />
            <h2>Your Cart is Empty</h2>
            <p className="empty-cart-message">Looks like you haven’t added anything to your cart yet.</p>
            <button onClick={() => navigate("/")} className="start-shopping-btn">
                Start Shopping
            </button>
            </div>
        )
        }
    </>)
}