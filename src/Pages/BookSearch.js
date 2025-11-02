import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import '../Css/Home.css'
import Bookcard from "../Components/BookCard";
import { useSelector } from "react-redux";
import { readBookPrice } from "../Slice/PriceSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Context/FirebaseContext";
import '../Css/ListBook.css';
import Loading from "../Components/Loading";
import '../Css/BookSearch.css'


export default function BookSearch(){

    const param = useParams();
    console.log(param,"param");

      const [allBooks,setAllBooks] =useState([]);
    //  const [newBook,setNewBook] =useState([]);
     
     const newBook = useSelector((state)=>state.admin);
     const [loading,setLoading] = useState(false);
     console.log("newbook Listbook",newBook)
     const navigate = useNavigate();
     const firebase = useFirebase();
    // const priceBook = useSelector((state)=>{state.price});
    const dispatch =useDispatch();
    const [pageId,setPageId] = useState(1);
    const [limitId,setLimitId] = useState(8);
    const paginationArr = (new Array(21)).fill(-1);
    const [paginationSlide,setPaginationSlide] = useState(0);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    console.log("paginationSlide",paginationSlide);
        
        useEffect(()=>{
            async function fetchBooks(){
                try{
                    setLoading(true);
                    const response = await axios.get(baseUrl,{
                        method:"GET",
                    });

                    if(response.status>=200 && response.status<300){
                        console.log("response",response?.data?.data?.data);
                        setAllBooks(response?.data?.data?.data.filter((item)=>{
                            return !!(item?.volumeInfo?.title?.toUpperCase().includes(param.booksearch?.toUpperCase()))
                        }));
                        response?.data?.data?.data.filter((item)=>{
                            return !!(item?.volumeInfo?.title?.includes(param.booksearch))
                        }).forEach((element) => {
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
                   setLoading(false);
                }
                catch(err){
                    console.log("Something went wrong while fetching books !!");
                    console.log(err);
                    setLoading(false);
                }
                
            }
            fetchBooks();
        },[param.booksearch]);

    return <>
        <Navbar/>
        {!loading ? <>
           <div className="no-match-container">
                <p className="search-text">Searched for: <span className="search-term">{param.booksearch}</span></p>
                {/* <p className="no-match-text">No match found</p> */}
           </div>
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
                        </>
                        :
                       <p className="no-match-message">
                             No results found for <span className="search-term">"{param.booksearch}"</span>.
                        </p>

                    }
            </>
            :
             <Loading/>
        
        }
    </>
}