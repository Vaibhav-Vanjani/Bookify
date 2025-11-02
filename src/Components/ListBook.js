import { useEffect, useState } from "react";
import axios from 'axios';
import '../Css/Home.css'
import Bookcard from "../Components/BookCard";
import { useSelector } from "react-redux";
import { readBookPrice } from "../Slice/PriceSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Context/FirebaseContext";
import NewlyAddedBook from "./NewlyAddedBook";
import '../Css/ListBook.css';
import { updateNewlyAddedBookCart } from '../Slice/AdminSlice';
import Loading from "./Loading";
import ProtectedRoute from "../Components/ProtectedRoute";



export default function ListBook(){

     const [allBooks,setAllBooks] =useState([]);
    //  const [newBook,setNewBook] =useState([]);
     
     const newBook = useSelector((state)=>state.admin);
    //  console.log("newbook Listbook",newBook)
     const navigate = useNavigate();
     const firebase = useFirebase();
     const baseUrl = process.env.REACT_APP_BASE_URL;
    // const priceBook = useSelector((state)=>{state.price});
    const dispatch =useDispatch();
    const [pageId,setPageId] = useState(1);
    const [limitId,setLimitId] = useState(8);
    const paginationArr = (new Array(21)).fill(-1);
    const [paginationSlide,setPaginationSlide] = useState(0);
    // console.log("paginationSlide",paginationSlide);
        
        useEffect(()=>{
            async function fetchBooks(){
                try{
                    const response = await axios.get(baseUrl+`?page=${pageId}&limit=${limitId}`,{
                        method:"GET",
                    });

                    if(response.status>=200 && response.status<300){
                        console.log("response",response?.data?.data?.data);
                        setAllBooks(response?.data?.data?.data);
                        const newBookResponse = await firebase.getDataFromDB('/new-book');
                        console.log("response",newBookResponse);
                        const arr = [];
                        for (const key in newBookResponse) {
                            const element = newBookResponse[key]?.data;
                            element.id = key;   
                            arr.push(element);
                        }
                        dispatch(updateNewlyAddedBookCart([...arr]));
                        response?.data?.data?.data.forEach((element) => {
                            console.log("insideforeach",element)
                                dispatch(readBookPrice({
                                    id: element.id,
                                    price: +(Math.random() * 1000).toFixed(2) // Generate random price, 2 decimal places
                                }));
                            });
                    }
                    else{
                         console.log("Something went wrong while fetching books !!");
                         console.log(response);
                    }
                }
                catch(err){
                    console.log("Something went wrong while fetching books !!");
                    console.log(err);
                }
                
            }
            fetchBooks();
        },[pageId,limitId]);

        const isAdminSignIn = useSelector((state)=>state.admin);
           if(!isAdminSignIn.isSignIn){
           return ( <ProtectedRoute/>);
          }

        return (<>
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        {

        !!newBook?.newlyAddedBook?.length && <div className="new-books-section">


            <h2 className="section-heading">📚 Newly Added</h2>

            <div className="newbook-list">
                {newBook?.newlyAddedBook?.map((item, index) => (
                <NewlyAddedBook key={index} newBook={item} />
                ))}
            </div>
        </div>
        }

        {
          
            
            (allBooks && allBooks?.length>0)?
            <> 
            <div className="book-card-container">
                {

                    allBooks.map((book)=>{
                       return <Bookcard key={book.id} book={book} bookKeyName={"Home"}></Bookcard>
                    })
                }
            </div>
            <div className="pagination">
                
                {
                paginationSlide<0 
                &&
                <span 
                    className="pagination__left-btn"
                    onClick={()=>{
                        setPaginationSlide(paginationSlide+1)
                    }}>
                 Previous
                </span>}
                   <nav className="pagination__nav"> 
                        <ul 
                        className="pagination__list" 
                        style={{ transform: `translateX(${paginationSlide * 45}%)`,
                                  transition: `transform 200ms` }}
                        >
                            {
                                paginationArr.map((page,index)=>{
                                return (
                                        <li 
                                            key={index}
                                            onClick={()=>setPageId(index+1)}
                                            className={"pagination__page-btn" + (pageId==(index+1) ? " pagination__active-page" : "")}>
                                                {index+1}
                                        </li>
                                        )
                                })
                            }     
                        </ul>
                    </nav>
               {
               paginationSlide>-12 &&
                <span 
                className="pagination__right-btn"
                onClick={()=>{
                    setPaginationSlide(paginationSlide-1)
                }}>
                Next
                </span>
             }
            </div>
            </> 
            
            :
            <> 
              <Loading/>
            </>
        }
           
        </>)
}