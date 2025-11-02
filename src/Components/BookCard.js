import { useSelector } from 'react-redux'
import '../Css/BookCard.css'
import { useDispatch } from 'react-redux';
import { decrement,increment } from '../Slice/CounterSlice';
import { useState } from 'react';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Bookcard({book,bookKeyName}){
    

    // console.log("bookcard",book);
    const price = useSelector((state)=>state.price);
    // console.log("price",price,price[book.id]);
    
    const location = useLocation();
    const navigate = useNavigate();
    // console.log(location);
    const isCart = location.pathname.includes('/cart');
    const isBookPage = location.pathname.includes('/book');
    const isOrderPage = location.pathname.includes('/order');
    const isAdminRoute = location.pathname.includes('/admin');
    
    
    const state = useSelector((state)=>state.counter);
    const ref = useRef(Math.random());
    // console.log("state.counter",state);
    let initialCount=0;
    state.forEach(element => {
        if(element.book.id == book.id){
            initialCount=element.count;
            return;
        }
    }); 
    // console.log(initialCount,"initialCount");
    const dispatch = useDispatch();
    const num = price[book.id] ?? (book?.saleInfo?.listPrice?.amount ?? (ref.current*1000).toFixed(2));
    const bookTitle = book?.volumeInfo?.title ?? book.title;
    const bookSrc = book?.volumeInfo?.imageLinks?.smallThumbnail ?? book.fileUrl;
    const bookAlt = book?.volumeInfo?.title ?? book.title;
    const bookDescription = book?.volumeInfo?.description;
    
    if(isCart || isBookPage){
         return (
            <div className="book-card--cart">
            <div className='book-card--cart-container'>
            <div
                className="book-card__title-img-bundle--cart"
                onClick={() => navigate(`/book/${book.id}-${num}`)}
            >
                <div className="book-card__img-container--cart">
                <img
                    src={bookSrc}
                    alt={bookAlt}
                    className="book-card__img--cart"
                />   
                </div>
            </div>
            <div className='book-card-info-bundle'>
             <div className="book-card__title--cart">{bookTitle}</div>
             {
             !!isCart && <div className="book-card__description--cart">{bookDescription?.substring(0,200) } {!!bookDescription && <><span onClick={()=>navigate(`/book/${book.id}-${num}`)}>...Read More</span></>}</div>
             }
            
            {
             !!isBookPage && <div className="book-card__description--cart">{bookDescription?.substring(0,500)} </div>
            }
            
            <div className="counter-btn counter-btn--cart">
                <div className="counter-btn__price--cart">
                <div className="counter-btn__original-price">₹{(num * 1.5).toPrecision(5)}</div>
                <div className="counter-btn__discounted-price">₹{num}</div>
                </div>

                <div className="counter counter--cart">
                {!!initialCount ? (
                    <>
                    <button
                        className="counter__btn counter__btn--decrement"
                        onClick={() =>
                        dispatch(decrement({ book, count: initialCount - 1, price: num }))
                        }
                        disabled={isOrderPage}
                    >
                        -
                    </button>
                    <span className="counter__value">{initialCount}</span>
                    <button
                        className="counter__btn counter__btn--increment"
                        onClick={() =>
                        dispatch(increment({ book, count: initialCount + 1, price: num }))
                        }
                        disabled={isOrderPage}
                    >
                        +
                    </button>
                    </>
                ) : (
                    <>
                    {!(!!isAdminRoute) && <button
                        className="counter__btn counter__btn--add"
                        onClick={() =>
                            dispatch(increment({ book, count: initialCount + 1, price: num }))
                        }
                        disabled={isOrderPage}
                        >
                            Add
                        </button>
                    }
                       {/* {!!isAdminRoute &&
                            <button className="counter__btn counter__btn--add"
                             onClick={removeItem} 
                             aria-label={`Remove ${newBook.title}`}>
                             Remove
                         </button>
                        } */}
                    </>
                    )
                        }
                        </div>
                
                    </div>
                    </div>
                </div>
                </div>
        )
    }

    
    return (
        <div
            className={isCart ? "book-card--insideCart" : "book-card"}>
            <div className={isCart ? "book-card__title-img-bundle--insideCart" : "book-card__title-img-bundle"}
                 onClick={()=>navigate(`/book/${book.id}-${num}`)}>
                <div className={isCart ? "book-card__title--insideCart" : "book-card__title"} >{bookTitle}</div>
                <div className={isCart ? "book-card__img-container--insideCart": "book-card__img-container"}>
                <img 
                src={bookSrc} 
                alt={bookAlt}
                className={isCart ? "book-card__img--insideCart" : "book-card__img"}/>
            </div>
             {!!isBookPage && <div>{bookDescription}</div>}
            </div>
            {/* <div className="book-card__description">{book.volumeInfo?.description?.substring(0,100)}... <button>Read More</button></div> */}
           <div className={isCart ? 'counter-btn--insideCart' : 'counter-btn'}>

            <div className={isCart ? 'counter-btn__price--insideCart' : 'counter-btn__price'}>
                <div style={{textDecoration: "line-through"}}>
                     {("₹" + (num*1.5).toPrecision(5))}
                </div>
                
                 <div>
                     {("₹" + num)}
                </div>
            </div>
                <div className={isCart? "counter--insideCart" : "counter"}>
                    {!!initialCount && <>
                                    <button className={isCart ? "counter__increment-btn--insideCart btn" : "counter__increment-btn btn"}
                                    onClick={()=>{
                                        // setCount(count-1)
                                        dispatch(decrement({book:book,count:initialCount-1,price:num}))
                                        }}>-</button>
                                    <span className={isCart ? "counter__value--insideCart btn" : "counter__value"}>{initialCount}</span>
                                    <button 
                                    className={isCart ? "counter__decrement-btn--insideCart btn" : "counter__decrement-btn btn"}
                                    onClick={()=>{
                                        // setCount(count+1)
                                        dispatch(increment({book:book,count:initialCount+1,price:num}))
                                        }}>+</button>  
                               </> 
                    }  

                    {!(!!isAdminRoute) &&  !initialCount && <button 
                        className={isCart ? "counter__add-btn--insideCart btn" : "counter__add-btn btn"}
                        onClick={()=>{
                            //    setCount(count+1)
                               dispatch(increment({book:book,count:initialCount+1,price:num}))
                    }}>Add</button>  }
                </div>   
            </div>
            
        </div>) 
    
}