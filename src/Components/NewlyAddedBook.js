import React, { useState } from 'react';
import '../Css/NewlyAddedBook.css';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { increment ,decrement } from '../Slice/CounterSlice';
import { useFirebase } from '../Context/FirebaseContext';
import { AdminSlice,removeFromNewlyAddedBookCart, updateNewlyAddedBookCart } from '../Slice/AdminSlice';

export default function NewlyAddedBook({ newBook }) {
  const firebase = useFirebase();
  const [count, setCount] = useState(0);
  const maxQuantity = newBook.quantity || 10;
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdminRoute = location.pathname.includes('/admin');

  const trackIncrement = () => {
    if (count < maxQuantity) {
      setCount(count + 1);
    }
  };

  const trackDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const removeItem = () => {
    // setCount(count-1);
    dispatch(removeFromNewlyAddedBookCart(newBook.id));
    console.log("removekey",'/new-book/' + newBook.id);
    firebase.deleteDataFromDB('/new-book/' + newBook.id)
  };

  return (
    <div className="newbook-card">
      <img src={newBook.fileUrl} alt={newBook.title} className="newbook-image" />

      <div className="newbook-info">
        <h3 className="newbook-title">{newBook.title}</h3>
        <p className="newbook-price">₹{newBook.price}</p>
      </div>

      <div className="newbook-controls" role="group" aria-label={`Quantity controls for ${newBook.title}`}>
        {count > 0 ? (
          <>
            <div className="quantity-box">
              <button
                className="qty-btn"
                onClick={
                ()=>{
                    trackDecrement();
                    dispatch(decrement({book:newBook,
                        count:count-1,
                        price:newBook.price
                    }))}
                }
                aria-label={`Decrease quantity of ${newBook.title}`}
              >
                −
              </button>
              <span className="qty-count" aria-live="polite">{count}</span>
              <button
                className="qty-btn"
               onClick={
                    ()=>{
                    trackIncrement();
                    dispatch(increment({book:newBook,
                        count:count+1,
                        price:newBook.price
                    }))}
                }
                disabled={count >= maxQuantity}
                aria-label={`Increase quantity of ${newBook.title}`}
              >
                +
              </button>
            </div>

           {!!isAdminRoute && <button className="remove-btn" onClick={removeItem} aria-label={`Remove ${newBook.title}`}>
              Remove
            </button>}
          </>
        ) : (
            <>
           {!(!!isAdminRoute) && <button
            className="add-btn"
            onClick={
                ()=>{
                trackIncrement();
                dispatch(increment({book:newBook,
                    count:count+1,
                    price:newBook.price
                }))}
            }
            aria-label={`Add ${newBook.title} to cart`}
          >
            Add
          </button>}

             {!!isAdminRoute && <button className="remove-btn" onClick={removeItem} aria-label={`Remove ${newBook.title}`}>
              Remove
            </button>}
            </>
        )}
      </div>
    </div>
  );
}
