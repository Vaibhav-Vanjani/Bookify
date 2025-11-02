import { useNavigate, useParams } from "react-router-dom"
import Bookcard from "../Components/BookCard";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useFirebase } from "../Context/FirebaseContext";
import Loading from "../Components/Loading";

export default function BookInfo(){
    
    const param = useParams();
    const [newBook,setNewBook] =useState([]);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const firebase = useFirebase();
    console.log(param.bookid.split('-'));
    const bookId = param?.bookid?.split('-').length>0 ? param.bookid?.split('-')[0] : 1;
    const navigate = useNavigate();
    const [bookInfo,setBookInfo] = useState([]);

      useEffect(()=>{
            async function fetchBooks(){
                try{
                  
                    if(Number(bookId)<300){
                        const response = await axios.get(baseUrl+`/${bookId}`,{
                            method:"GET",
                        });

                        if(response.status>=200 && response.status<300){
                            console.log("response",response?.data?.data);
                            setBookInfo(response?.data?.data);
                        }
                        else{
                            console.log("Something went wrong while fetching books !!");
                            console.log(response);
                        }
                    }
                    else{
                        const newBookResponse = await firebase.getDataFromDB(`/new-book/${bookId}`);
                        console.log("newBookResponse",newBookResponse?.data);
                        newBookResponse.data.id = bookId;
                        setBookInfo(newBookResponse?.data);
                    }
                }
                catch(err){
                    console.log("Something went wrong while fetching books !!");
                    console.log(err);
                }
                
            }
            fetchBooks();
        },[]);
    
    return (<>
        <button className='back-button' onClick={()=>navigate(-1)}> Back </button>
        {
            !!bookInfo?.id ? 
            <><Bookcard book={bookInfo}></Bookcard></> 
            :
            <Loading/>
        }
    </>)
}