import { useEffect, useState } from "react";
import axios, { all } from 'axios';
import '../Css/Home.css'
import Bookcard from "../Components/BookCard";
import { useSelector } from "react-redux";
import { readBookPrice } from "../Slice/PriceSlice";
import { useDispatch } from "react-redux";
import ImageSlider from "../Components/ImageSlider";
import Navbar from "../Components/Navbar";
import Form from "../Components/Form";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Context/FirebaseContext";
import NewlyAddedBook from "../Components/NewlyAddedBook";
import '../Css/ListBook.css'
import Loading from "../Components/Loading";


export default function Home(params) {

    const [allBooks,setAllBooks] =useState([]);
     const [newBook,setNewBook] =useState([]);
     const navigate = useNavigate();
     const firebase = useFirebase();
    // const priceBook = useSelector((state)=>{state.price});
    const dispatch =useDispatch();
    const [pageId,setPageId] = useState(1);
    const [limitId,setLimitId] = useState(8);
    const paginationArr = (new Array(21)).fill(-1);
    const [paginationSlide,setPaginationSlide] = useState(0);
    console.log("paginationSlide",paginationSlide);
    const baseUrl = process.env.REACT_APP_BASE_URL;
        
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
                        setNewBook([...arr]);
                        response?.data?.data?.data.forEach((element) => {
                            console.log("insideforeach",element)
                                dispatch(readBookPrice({
                                    id: element.id,
                                    price: +(Math.random() * 1000).toFixed(2) // Generate random price, 2 decimal places
                                }));
                            });
                         [...arr].forEach((element) => {
                            console.log("insideforeach",element)
                                dispatch(readBookPrice({
                                    id: element.id,
                                    price: element.price // Generate random price, 2 decimal places
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

        return (<>
        <Form></Form>
        <Navbar></Navbar>
        <ImageSlider/>
       {!!newBook?.length && <div className="new-books-section">
                    <h2 className="section-heading">📚 Newly Added</h2>
        
                    <div className="newbook-list">
                        {newBook.map((item, index) => (
                        <NewlyAddedBook key={index} newBook={item} />
                        ))}
                    </div>
        </div>}
        {
            // console.log(allBooks,"allbooks")
            
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